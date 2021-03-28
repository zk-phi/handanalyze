const vm = new Vue({
    el: "#app",
    data: {
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "", count: 4 }],
        },
        target: {
            priorClauses: [[
                { type: 'min', value: 0 }
            ]],
            posteriorClauses: [[
                { type: 'min', value: 1 }
            ]],
        },
        tree: null,
        count: {
            prior: null,
            posterior: null,
        },
        result: "-",
    },
    watch: {
        source: {
            handler: () => {
                vm.tree = null;
                vm.count.prior = null;
                vm.count.posterior = null;
            },
            deep: true
        },
        'target.priorClauses': {
            handler: () => { vm.count.prior = null; },
            deep: true
        },
        'target.posteriorClauses': {
            handler: () => { vm.count.posterior = null; },
            deep: true
        },
    },
    filters: {
        formatProb: function (prob) {
            const match = (prob + "").match(/^[^1-9]*\.00+[^0]/);
            if (match) return match[0];

            const parts = (prob + "").split(".");
            return parts[0] + "." + (parts[1] || "").substring(0, 2);
        }
    },
    methods: {
        delCard: function (ix) {
            vm.source.cards.splice(ix, 1);
            vm.target.priorClauses.forEach((c) => { c.splice(ix, 1); });
            vm.target.posteriorClauses.forEach((c) => { c.splice(ix, 1); });
        },
        addCard: function () {
            vm.source.cards.push({ label: "", count: 4 });
            vm.target.priorClauses.forEach((c) => { c.push({ type: 'min', value: 0 }); });
            vm.target.posteriorClauses.forEach((c) => { c.push({ type: 'min', value: 1 }); });
        },
        delPriorClause: function (ix) {
            vm.target.priorClauses.splice(ix, 1);
        },
        addPriorClause: function () {
            vm.target.priorClauses.push(vm.source.cards.map(() => ({ type: 'min', value: 0 })));
        },
        delPosteriorClause: function (ix) {
            vm.target.posteriorClauses.splice(ix, 1);
        },
        addPosteriorClause: function () {
            vm.target.posteriorClauses.push(vm.source.cards.map(() => ({ type: 'min', value: 1 })));
        },
        compute: function () {
            if (this.tree == null) {
                this.tree = makeTree(this.source.cards, this.source.deckNum, this.source.handNum);
            }
            if (this.count.prior == null) {
                this.count.prior = countForClauses(
                    this.source.cards,
                    this.tree,
                    this.target.priorClauses
                );
            }
            if (this.count.posterior == null) {
                this.count.posterior = countForClauses(
                    this.source.cards,
                    this.tree,
                    this.target.posteriorClauses
                );
            }
            this.result = 100 * (this.count.posterior / this.count.prior);
        },
    }
});

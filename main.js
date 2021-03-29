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
        cache: {
            patterns: null,
            compiledPriorClause: null,
            compiledPosteriorClause: null,
        },
        result: "-",
    },
    watch: {
        source: {
            handler: () => {
                vm.cache.patterns = null;
                vm.cache.compiledPriorClause = null;
                vm.cache.compiledPosteriorClause = null;
            },
            deep: true
        },
        'target.priorClauses': {
            handler: () => {
                vm.cache.compiledPriorClause = null;
                vm.cache.compiledPosteriorClause = null;
            },
            deep: true
        },
        'target.posteriorClauses': {
            handler: () => {
                vm.cache.compiledPosteriorClause = null;
            },
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
            if (this.cache.patterns == null) {
                this.cache.patterns = computePatterns(
                    this.source.cards,
                    this.source.deckNum,
                    this.source.handNum
                );
            }
            if (this.cache.compiledPriorClause == null) {
                this.cache.compiledPriorClause = unionCompiledClauses(
                    this.target.priorClauses.map((c) => compileClause(this.source.cards, c))
                );
            }
            if (this.cache.compiledPosteriorClause == null) {
                this.cache.compiledPosteriorClause = intersectCompiledClauses([
                    this.cache.compiledPriorClause,
                    unionCompiledClauses(
                        this.target.posteriorClauses.map((c) => compileClause(this.source.cards, c))
                    )
                ]);
            }
            const prior = executeCompiledClause(
                this.cache.patterns,
                this.cache.compiledPriorClause
            );
            const posterior = executeCompiledClause(
                this.cache.patterns,
                this.cache.compiledPosteriorClause
            );
            this.result = 100 * (posterior / prior);
        },
    }
});

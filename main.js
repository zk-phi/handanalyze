const vm = new Vue({
    el: "#app",
    data: {
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "目当てのカード", count: 4 }],
        },
        target: {
            priorClauses: [[
                { type: 'min', value: 0 }
            ]],
            posteriorClauses: [[
                { type: 'min', value: 1 }
            ]],
        },
        showDetails: false,
        result: "-",
    },
    watch: {
        source: {
            handler: () => { vm.compute(); },
            deep: true
        },
        target: {
            handler: () => { vm.compute(); },
            deep: true
        },
    },
    mounted: function () {
        this.compute();
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
        toggleShowDetails: function () {
            vm.showDetails = !vm.showDetails;
        },
        delCard: function (ix) {
            vm.source.cards.splice(ix, 1);
            vm.target.priorClauses.forEach((c) => { c.splice(ix, 1); });
            vm.target.posteriorClauses.forEach((c) => { c.splice(ix, 1); });
        },
        addCard: function () {
            vm.source.cards.push({ label: "", count: 4 });
            vm.target.priorClauses.forEach((c) => { c.push({ type: 'min', value: 0 }); });
            vm.target.posteriorClauses.forEach((c) => { c.push({ type: 'min', value: 0 }); });
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
            vm.target.posteriorClauses.push(vm.source.cards.map(() => ({ type: 'min', value: 0 })));
        },
        setPreset: function (ix) {
            this.source = PRESETS[ix].source;
            this.target = PRESETS[ix].target;
        },
        compute: function () {
            const patterns = computePatterns(
                this.source.cards,
                this.source.deckNum,
                this.source.handNum
            );
            const compiledPriorClause = unionCompiledClauses(
                this.target.priorClauses.map((c) => compileClause(
                  this.source.cards,
                  c,
                  this.source.handNum,
                ))
            );
            const compiledPosteriorClause = intersectCompiledClauses([
                compiledPriorClause,
                unionCompiledClauses(
                    this.target.posteriorClauses.map((c) => compileClause(
                      this.source.cards,
                      c,
                      this.source.handNum,
                    ))
                )
            ]);
            const prior = executeCompiledClause(patterns, compiledPriorClause);
            const posterior = executeCompiledClause(patterns, compiledPosteriorClause);
            this.result = 100 * (posterior / prior);
        },
    }
});

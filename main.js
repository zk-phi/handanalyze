const urlparam = location.href.split("?")[1];

let initialConfig;

if (urlparam) {
    try {
        initialConfig = rison.decode(decodeURI(urlparam));
    } catch (e) {
        console.log("failed to parse urlparam");
    }
}

const vm = new Vue({
    el: "#app",
    data: {
        COLORS: ["#ff6565", "#ffe965", "#91ff65", "#65ffbd", "#65bdff", "#9165ff", "#ff65e9"],
        source: initialConfig?.source ?? {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "目当てのカード", count: 4 }],
        },
        target: initialConfig?.target ?? {
            priorClauses: [[
                { type: 'min', value: 0 }
            ]],
            posteriorClauses: [[
                { type: 'min', value: 1 }
            ]],
        },
        showDetails: false,
        result: 0,
        hands: [],
        permalink: null,
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
            return prob.toFixed(2);
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
            const hands = computeHands(
                this.source.cards,
                this.source.deckNum,
                this.source.handNum,
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
            let sum = 0;
            this.hands = hands.map((hand, ix) => ({
                hand,
                probablity: patterns[ix] / prior,
                score: compiledPosteriorClause[ix],
            })).filter((_, ix) => (
                compiledPriorClause[ix]
            )).sort((a, b) => (
                b.probablity - a.probablity
            )).map((hand) => ({
                ...hand,
                fromProb: sum,
                toProb: (sum += hand.probablity),
            }));
            this.result = posterior / prior;
        },
        bgChart: function (fromProb, toProb, highlight) {
            const color = highlight ? "pink" : "gainsboro";
            const fromPercentile = fromProb * 100;
            const toPercentile = toProb * 100;
            return (
                "linear-gradient(to right, " +
                `transparent ${fromPercentile}%, ${color} ${fromPercentile}%, ` +
                `${color} ${toPercentile}%, transparent ${toPercentile}%)`
            );
        },
        genLink: function () {
            this.permalink = encodeURI(
                location.href.split("?")[0] + "?" + rison.encode({
                    source: this.source,
                    target: this.target,
                })
            );
        },
    }
});

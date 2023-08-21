const PRESETS = [
    {
        label: "目当てのカードが１枚以上引ける確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "目当てのカード", count: 4 }]
        },
        target: {
            priorClauses: [[{ type: 'min', value: 0 }]],
            posteriorClauses: [[{ type: 'min', value: 1 }]],
        }
    }, {
        label: "目当てのカードが２枚以上引ける確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "目当てのカード", count: 12 }]
        },
        target: {
            priorClauses: [[{ type: 'min', value: 0 }]],
            posteriorClauses: [[{ type: 'min', value: 2 }]],
        }
    }, {
        label: "引いてはいけないカードを引かない確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [{ label: "引いてはいけないカード", count: 1 }]
        },
        target: {
            priorClauses: [[{ type: 'min', value: 0 }]],
            posteriorClauses: [[{ type: 'exact', value: 0 }]],
        }
    }, {
        label: "２枚コンボが揃う確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [
                { label: "必要なカード (1)", count: 4 },
                { label: "必要なカード (2)", count: 4 },
            ]
        },
        target: {
            priorClauses: [[
                { type: 'min', value: 0 },
                { type: 'min', value: 0 },
            ]],
            posteriorClauses: [[
                { type: 'min', value: 1 },
                { type: 'min', value: 1 },
            ]],
        }
    }, {
        label: "３枚コンボが揃う確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [
                { label: "必要なカード (1)", count: 4 },
                { label: "必要なカード (2)", count: 4 },
                { label: "必要なカード (3)", count: 4 },
            ]
        },
        target: {
            priorClauses: [[
                { type: 'min', value: 0 },
                { type: 'min', value: 0 },
                { type: 'min', value: 0 },
            ]],
            posteriorClauses: [[
                { type: 'min', value: 1 },
                { type: 'min', value: 1 },
                { type: 'min', value: 1 },
            ]],
        }
    }, {
        label: "遊戯/誘発と初動を両方引ける確率",
        source: {
            handNum: 5,
            deckNum: 40,
            cards: [
                { label: "誘発", count: 11 },
                { label: "一枚初動", count: 3 },
                { label: "二枚初動", count: 12 },
            ]
        },
        target: {
            priorClauses: [
                [{ type: 'min', value: 0 }, { type: 'min', value: 0 }, { type: 'min', value: 0 }],
            ],
            posteriorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 1 }, { type: 'min', value: 0 }],
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }, { type: 'min', value: 2 }],
            ],
        }
    }, {
        label: "ポケカ/スタートしたくない種でスタートしてしまう確率",
        source: {
            handNum: 7,
            deckNum: 60,
            cards: [
                { label: "スタートしたくない種", count: 2 },
                { label: "その他の種", count: 10 },
            ]
        },
        target: {
            priorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }],
                [{ type: 'min', value: 0 }, { type: 'min', value: 1 }],
            ],
            posteriorClauses: [
                [{ type: 'min', value: 1 }, { type: 'exact', value: 0 }],
            ],
        }
    }, {
        label: "ポケカ/目当ての種でスタートできる確率",
        source: {
            handNum: 7,
            deckNum: 60,
            cards: [
                { label: "目当ての種", count: 4 },
                { label: "その他の種", count: 6 },
            ]
        },
        target: {
            priorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }],
                [{ type: 'min', value: 0 }, { type: 'min', value: 1 }],
            ],
            posteriorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }],
            ],
        }
    }, {
        label: "ポケカ/目当ての種を先１で立てられる確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [
                { label: "目当ての種", count: 4 },
                { label: "サーチ", count: 8 },
                { label: "その他の種", count: 6 },
            ]
        },
        target: {
            priorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }, { type: 'min', value: 0 }],
                [{ type: 'min', value: 0 }, { type: 'min', value: 0 }, { type: 'min', value: 1 }],
            ],
            posteriorClauses: [
                [{ type: 'min', value: 1 }, { type: 'min', value: 0 }, { type: 'min', value: 0 }],
                [{ type: 'min', value: 0 }, { type: 'min', value: 1 }, { type: 'min', value: 1 }],
            ],
        }
    }
];

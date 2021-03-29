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
        label: "デデンネスタート率",
        source: {
            handNum: 7,
            deckNum: 60,
            cards: [
                { label: "デデンネなど", count: 2 },
                { label: "その他の種ポケ", count: 10 },
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
        label: "目当ての種ポケをバトル場に置いてスタートできる確率",
        source: {
            handNum: 7,
            deckNum: 60,
            cards: [
                { label: "目当ての種ポケ", count: 4 },
                { label: "その他の種ポケ", count: 6 },
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
        label: "目当ての種ポケを先１で立てられる確率",
        source: {
            handNum: 8,
            deckNum: 60,
            cards: [
                { label: "目当ての種ポケ", count: 4 },
                { label: "サーチ", count: 8 },
                { label: "その他の種ポケ", count: 6 },
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

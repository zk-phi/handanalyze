var facts = [1];
function fact (n) {
    if (!facts[n]) {
        facts[n] = fact(n - 1) * n;
    }
    return facts[n];
}

function ncr (n, r) {
    return fact(n) / fact(n - r) / fact(r);
}

/* ------ */

function computePatterns (cards, numDeck, numHand) {
    const arr = [];

    let rec = (patterns, deck, hand, ix) => {
        if (ix == cards.length - 1) { /* leaf */
            return Array.from({ length: cards[ix].count + 1 }).forEach((_, num) => {
                const p = hand >= num ? (
                    ncr(cards[ix].count, num) * ncr(deck - cards[ix].count, hand - num)
                ) : 0;
                arr.push(patterns * p);
            });
        } else { /* node */
            return Array.from({ length: cards[ix].count + 1 }).forEach((_, num) => {
                const p = hand >= num ? ncr(cards[ix].count, num) : 0;
                rec(patterns * p, deck - cards[ix].count, hand - num, ix + 1);
            });
        }
    };
    rec(1, numDeck, numHand, 0);

    return arr;
}

/* --------- */

function inRange (range, val) {
    if (range.type === 'exact') return val === range.value;
    if (range.type === 'min') return val >= range.value;
    if (range.type === 'max') return val <= range.value;
    throw "Unknown range type";
}

function compileClause (cards, ranges) {
    const arr = [];

    let rec = (ix, alive) => {
        if (ix == cards.length - 1) { /* leaf */
            return Array.from({ length: cards[ix].count + 1 }).forEach((_, num) => {
                arr.push(alive && inRange(ranges[ix], num));
            });
        } else { /* node */
            return Array.from({ length: cards[ix].count + 1 }).forEach((_, num) => {
                rec(ix + 1, alive && inRange(ranges[ix], num));
            });
        }
    };
    rec(0, true);

    return arr;
}

function unionCompiledClauses (clauses) {
    if (!clauses.length) throw "List is empty";
    return Array.from({ length: clauses[0].length }).map((_, ix) => (
        clauses.some((tree) => tree[ix])
    ));
}

function intersectCompiledClauses (clauses) {
    if (!clauses.length) throw "List is empty";
    return Array.from({ length: clauses[0].length }).map((_, ix) => (
        clauses.every((tree) => tree[ix])
    ));
}

function executeCompiledClause (patterns, clause) {
    let sum = 0;
    patterns.forEach((count, ix) => { sum += clause[ix] ? count : 0; });
    return sum;
}

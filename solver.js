const _facts = [1];
function fact (n) {
    if (!_facts[n]) {
        _facts[n] = fact(n - 1) * n;
    }
    return _facts[n];
}

function ncr (n, r) {
    if (!(n >= r && r >= 0 && n >= 0)) return 0;
    return fact(n) / fact(n - r) / fact(r);
}

/* ------ */

/*
 * compute and count all possible hands
 *
 * sample input: {
 *   cards: [
 *     { count: 7 }, // card A
 *     { count: 3 }, // card B
 *   ],
 *   numDeck: 40, // 32 extra cards
 *   numHand: 5,
 * }
 *
 * sample output: [
 *           // A B hand
 *   142506, // 0 0 *****
 *   82214,  // 0 1 B****
 *   12179,  // 0 2 BB***
 *   435,    // 0 3 BBB**
 *   191834, // 1 0 A****
 *   85259,  // 1 1 AB***
 *   9135,   // 1 2 ABB**
 *   210,    // 1 3 ABBB*
 *   85259,  // 2 0 AA***
 *   27405,  // 2 1 AAB**
 *   1890,   // 2 2 AABB*
 *   21,     // 2 3 AABBB
 *   15225,  // 3 0 AAA**
 *   3150,   // 3 1 AAAB*
 *   105,    // 3 2 AAABB
 *   1050,   // 4 0 AAAA*
 *   105,    // 4 1 AAAAB
 *   21,     // 5 0 AAAAA
 * ]
 */

function computePatterns (cards, numDeck, numHand) {
    const arr = [];

    let rec = (patterns, deck, hand, ix) => {
        if (ix == cards.length - 1) { /* leaf */
            return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
                const p = ncr(cards[ix].count, num) * ncr(deck - cards[ix].count, hand - num);
                arr.push(patterns * p);
            });
        } else { /* node */
            return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
                const p = ncr(cards[ix].count, num);
                rec(patterns * p, deck - cards[ix].count, hand - num, ix + 1);
            });
        }
    };
    rec(1, numDeck, numHand, 0);

    return arr;
}

function computeHands (cards, numDeck, numHand) {
  const arr = [];

  let rec = (pattern, deck, hand, ix) => {
    if (ix == cards.length - 1) { /* leaf */
      return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
        const pat = pattern.concat(
          Array.from({ length: num }).map(() => ix),
          Array.from({ length: hand - num }).map(() => null),
        );
        arr.push(pat);
      });
    } else { /* node */
      return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
        const pat = pattern.concat(Array.from({ length: num }).map(() => ix));
        rec(pat, deck - cards[ix].count, hand - num, ix + 1);
      });
    }
  };
  rec([], numDeck, numHand, 0);

  return arr;
}

/* --------- */

function inRange (range, val) {
    if (range.type === 'exact') return val === range.value;
    if (range.type === 'min') return val >= range.value;
    if (range.type === 'max') return val <= range.value;
    throw "Unknown range type";
}

function compileClause (cards, ranges, numHand) {
    const arr = [];

    let rec = (alive, hand, ix) => {
        if (ix == cards.length - 1) { /* leaf */
            return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
                arr.push(alive && inRange(ranges[ix], num));
            });
        } else { /* node */
            return Array.from({ length: Math.min(cards[ix].count, hand) + 1 }).forEach((_, num) => {
                rec(alive && inRange(ranges[ix], num), hand - num, ix + 1);
            });
        }
    };
    rec(true, numHand, 0);

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

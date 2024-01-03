(function () {
  let shift = BigInt(33)
  let value1 = BigInt(0xff51afd7ed558ccd)
  let value2 = BigInt(0xc4ceb9fe1a85ec53)

  let bigUint64Array = new BigUint64Array(1);
  bigUint64Array[0] = BigInt(-1)
  let val__ = bigUint64Array[0]
  let normalizer = (it) => it & val__

  /**@param {bigint} x*/
  function murmurHash3(x) {

    x = normalizer(x ^ normalizer(x >> shift));
    x = normalizer(x * value1);
    x = normalizer(x ^ normalizer(x >> shift));
    x = normalizer(x * value2);
    x = normalizer(x ^ normalizer(x >> shift));
    return x;
  }

  /**@type {{seed0:BigUint64Array,seed1:BigUint64Array}}*/
  let seeds
  {
    let seed0 = new BigUint64Array(1)
    let seed1 = new BigUint64Array(1)
    seeds = {seed0, seed1}
  }
  let value_1 = BigInt(23)
  let value_2 = BigInt(17)
  let value_3 = BigInt(26)
  let float_scale = BigInt(40)
  let NORM_FLOAT = 5.960464477539063e-08
  console.log(NORM_FLOAT);
  Math.rand = {

    /**
     * @param {bigint} seed
     * @param {bigint} seed2
     */
    setSeed(seed, seed2 = undefined) {
      if (typeof seed != "bigint") seed = BigInt(seed)
      if (seed2 === undefined) seed2 = murmurHash3(seed)
      if (typeof seed2 != "bigint") seed2 = BigInt(seed2)
      seeds.seed0[0] = normalizer(seed)
      seeds.seed1[0] = normalizer(seed2)
    },
    nextLong() {
      let s1 = seeds.seed0;
      const s0 = seeds.seed1;
      seeds.seed0 = s0;
      seeds.seed1 = s1;
      s1[0] = normalizer(s1[0] ^ (s1[0] << value_1));
      s1[0] = normalizer(s1[0] ^ s0[0] ^ (s1[0] >> value_2) ^ (s0[0] >> value_3))
      return normalizer(s1[0] + s0[0]);
    },
    /**
     * Returns a pseudo-random, uniformly distributed {@code float} value between 0.0 and 1.0 from this random number generator's
     * sequence.
     * <p>
     * This implementation uses internally.
     */
    nextFloat() {
      return (Number(this.nextLong() >> float_scale) * NORM_FLOAT);
    }
  }
  Math.rand.setSeed(new Date().getTime())
  console.log("it")
  Math.random = () => Math.rand.nextFloat()
})()

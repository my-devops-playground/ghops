function sequentialize(callback) {
  return async (previous, next) => {
    await previous;
    return callback(next);
  };
}

function reduceAsyncSeq(collection, callback) {
  return collection.reduce(sequentialize(callback), Promise.resolve());
}

export { reduceAsyncSeq };

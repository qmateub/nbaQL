import camelcase from 'lodash.camelcase';

export const transformResponse = data => {
  const headers = data.resultSets[0].headers;
  const rowSets = data.resultSets[0].rowSet;

  return rowSets.reduce(
    (results, rowSet) => [
      ...results,
      rowSet.reduce(
        (game, row, index) => ({
          ...game,
          [camelcase(headers[index])]: row,
        }),
        {}
      ),
    ],
    []
  );
};

export default transformResponse;

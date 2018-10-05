module.exports.fetchHistory = fetchHistory;

function fetchHistory(request) {
  const answer = [];
  answer.push(
    [{Who: 651057, What: 'tttttttt - ' + request.wantedUserId, When: 1538248506000},
    {Who: 952135, What: 'bbbbbbbbb', When: 1538248506001}], '15382340765976699', '15382342792378985'
  );
  return answer;
}

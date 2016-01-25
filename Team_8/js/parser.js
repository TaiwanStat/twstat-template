
<script src="./jquery-2.2.0.min.js"></script>
<script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script>
<script>

function getData( id,  year){
  var firebase = new Firebase("https://fiery-inferno-4186.firebaseio.com/id2name/" + id);

  firebase.once("value", function(snapshot) {

    var data = snapshot.val();
    obj = JSON.parse(data);

    /** Start 取得選手個人資訊 **/
    console.log(obj.player_id);
    console.log(obj.first_name);
    console.log(obj.last_name);
    console.log(obj.hand);
    console.log(obj.birth_date);
    console.log(obj.country_code);
    /** End 取得選手個人資訊 **/

    /** Start 取得檔年分排名 **/
    var contest_atp_rankings = []; // 當年分排名， Type : Array
    for(var i = 0; i < obj.atp_rankings.length; i++){
      var cur_rankings = obj.atp_rankings[i];
      if(new String(Object.keys(cur_rankings)[0]).valueOf() == new String(year).valueOf()){
        var ranks = JSON.parse(cur_rankings[Object.keys(cur_rankings)[0]]);
        for(var j = 0; j < ranks.length; ++j){
          contest_atp_rankings[j] = Number(ranks[j]);
        }
        break;
      }
    }
    console.log("\nranking");
    console.log(contest_atp_rankings); // 如果為NaN的畫就是沒排名
    /** End 取得檔年分排名 **/

    /** Start 取得當年分分別各賽事紅土、草地、硬地勝敗場 **/
    // atp_matches
    var contest_atp_matches_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches.length; ++i){
        var atp_matches = obj.atp_matches[i];
        if(new String(Object.keys(atp_matches)[0]).valueOf() == new String(year).valueOf()){
          console.log(Object.keys(atp_matches)[0] + " " + atp_matches[Object.keys(atp_matches)[0]]);
          var stringGrass = atp_matches[Object.keys(atp_matches)[0]][0]["Grass"].split(" ");
          var stringHard = atp_matches[Object.keys(atp_matches)[0]][1]["Hard"].split(" ");
          var stringClay = atp_matches[Object.keys(atp_matches)[0]][2]["Clay"].split(" ");
          contest_atp_matches_grass[0] = Number(stringGrass[0]);contest_atp_matches_grass[1] = Number(stringGrass[1]);
          contest_atp_matches_hard[0] = Number(stringHard[0]);contest_atp_matches_hard[1] = Number(stringHard[1]);
          contest_atp_matches_clay[0] = Number(stringClay[0]);contest_atp_matches_clay[1] = Number(stringClay[1]);
          break;
        }
    }
    console.log("\natp_matches");
    console.log(contest_atp_matches_grass);
    console.log(contest_atp_matches_hard);
    console.log(contest_atp_matches_clay);

    // atp_matches_futures
    var contest_atp_matches_futures_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_futures_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_futures_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches_futures.length; ++i){
      var cur_matches_future = obj.atp_matches_futures[i];
      if(new String(Object.keys(cur_matches_future)[0]).valueOf() == new String(year).valueOf()){
        console.log(Object.keys(cur_matches_future)[0] + " " + cur_matches_future[Object.keys(cur_matches_future)[0]]);
        var stringGrass = cur_matches_future[Object.keys(cur_matches_future)[0]][0]["Grass"].split(" ");
        var stringHard = cur_matches_future[Object.keys(cur_matches_future)[0]][1]["Hard"].split(" ");
        var stringClay = cur_matches_future[Object.keys(cur_matches_future)[0]][2]["Clay"].split(" ");
        contest_atp_matches_futures_grass[0] = Number(stringGrass[0]);contest_atp_matches_futures_grass[1] = Number(stringGrass[1]);
        contest_atp_matches_futures_hard[0] = Number(stringHard[0]);contest_atp_matches_futures_hard[1] = Number(stringHard[1]);
        contest_atp_matches_futures_clay[0] = Number(stringClay[0]);contest_atp_matches_futures_clay[1] = Number(stringClay[1]);
        break;
      }
    }
    console.log("\natp_matches_futures");
    console.log(contest_atp_matches_futures_grass);
    console.log(contest_atp_matches_futures_hard);
    console.log(contest_atp_matches_futures_clay);

    // atp_matches_qual_chall
    var contest_atp_matches_qual_chall_grass = [0,0]; // 草地[勝場，輸場]，Type : Array
    var contest_atp_matches_qual_chall_hard = [0,0]; // 硬地[勝場，輸場]，Type : Array
    var contest_atp_matches_qual_chall_clay = [0,0]; // 紅土[勝場，輸場]，Type : Array
    for(var i = 0; i < obj.atp_matches_qual_chall.length; ++i){
      var atp_matches_qual_chall = obj.atp_matches_qual_chall[i];
      if(new String(Object.keys(atp_matches_qual_chall)[0]).valueOf() == new String(year).valueOf()){
        console.log(Object.keys(atp_matches_qual_chall)[0] + " " + atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]]);
        var stringGrass = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][0]["Grass"].split(" ");
        var stringHard = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][1]["Hard"].split(" ");
        var stringClay = atp_matches_qual_chall[Object.keys(atp_matches_qual_chall)[0]][2]["Clay"].split(" ");
        contest_atp_matches_qual_chall_grass[0] = Number(stringGrass[0]);contest_atp_matches_qual_chall_grass[1] = Number(stringGrass[1]);
        contest_atp_matches_qual_chall_hard[0] = Number(stringHard[0]);contest_atp_matches_qual_chall_hard[1] = Number(stringHard[1]);
        contest_atp_matches_qual_chall_clay[0] = Number(stringClay[0]);contest_atp_matches_qual_chall_clay[1] = Number(stringClay[1]);
        break;
      }
    }
    console.log("\natp_matches_qual_chall");
    console.log(contest_atp_matches_qual_chall_grass);
    console.log(contest_atp_matches_qual_chall_hard);
    console.log(contest_atp_matches_qual_chall_clay);

    // 當年份總和
    var contest_grass_total = [0,0]; // 草地總和
    var contest_hard_total = [0,0]; // 硬地總和
    var contest_clay_total = [0,0]; // 紅土總和
    contest_grass_total[0] = contest_atp_matches_grass[0] + contest_atp_matches_futures_grass[0] + contest_atp_matches_qual_chall_grass[0];
    contest_hard_total[0] = contest_atp_matches_hard[0] + contest_atp_matches_futures_hard[0] + contest_atp_matches_qual_chall_hard[0];
    contest_clay_total[0] = contest_atp_matches_clay[0] + contest_atp_matches_futures_clay[0] + contest_atp_matches_qual_chall_clay[0];
    contest_grass_total[1] = contest_atp_matches_grass[1] + contest_atp_matches_futures_grass[1] + contest_atp_matches_qual_chall_grass[1];
    contest_hard_total[1] = contest_atp_matches_hard[1] + contest_atp_matches_futures_hard[1] + contest_atp_matches_qual_chall_hard[1];
    contest_clay_total[1] = contest_atp_matches_clay[1] + contest_atp_matches_futures_clay[1] + contest_atp_matches_qual_chall_clay[1];
    console.log("\ntotal");
    console.log(contest_grass_total);
    console.log(contest_hard_total);
    console.log(contest_clay_total);
    /** End 取得當年分分別各賽事紅土、草地、硬地勝敗場 **/
  });
}

/** Start 使用方式 **/
getData("100000", "2000");
/** End 使用方式 **/

</script>

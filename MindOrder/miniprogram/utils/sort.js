
export function sort(that,dataList){
  for (let i = 0; i < dataList.length-1;i++){
    for (var j = 0; j < dataList.length-1;j++){
      if (dataList[j].num.length <= dataList[j+1].num.length){
        var temp={};
        temp = dataList[j];
        dataList[j] = dataList[j+1];
        dataList[j+1]=temp;
      }
    }
  }
}
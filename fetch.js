export const getData  = (url) => {
  return fetch(url).then((res) => {
    if(res.ok){
      return res.json();
    }else{
      throw Error;
    }
  })
}
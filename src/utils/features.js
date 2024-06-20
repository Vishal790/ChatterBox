import moment from "moment";

export const fileFormat = (url) => {
  const fileExtension = url.split(".").pop();

  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "ogg"
  )
    return "video";

  if (
    fileExtension === "mp3" ||
    fileExtension === "wav" 
   
  )
    return "audio";

  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg"
  )
    return "image";


return "file";
};


export const getLastSevenDays = ()=>{
  const currentDate = moment();
  const lastSevenDays = [];

  for (let i = 0; i < 7; i++) {
    lastSevenDays.push(
      currentDate.clone().subtract(i, "days").format("dddd")
    );
  }

  return lastSevenDays.reverse();
}


export const transformImage =(url="",width=100)=>{
  const newUrl = url.replace('upload/',`upload/dpr_auto/w_${width}/`)

  return newUrl;

}


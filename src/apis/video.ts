import request from ".";

let mongo = {
  dataSource: "Cluster0",
  database: "d3_box",
  collection: "Video",
};

export async function getVideos(): Promise<{ documents: any[] }> {
  return request.post("/find", mongo);
}

import request from ".";
import { Video } from "../schemas";

export async function getVideos(
  state: "ing" | "done" | "not" = "ing"
): Promise<any[]> {
  return request.get(`/video/${state}`);
}

export async function addEpisode(id: string): Promise<Video[]> {
  return request.put(`/video/${id}`);
}

export async function addVideo(data: any): Promise<Video> {
  return request.post(`/video/`, data);
}

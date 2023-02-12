import _ from "lodash";
import type { Playlist, Video } from "youtube-sr";
import { YouTube } from "youtube-sr";

export class Util {
  /**
   * Search youtube song by name or URL
   *
   * @param input
   *
   * @returns
   */
  static getSong(input: string): Promise<Video | undefined> {
    try {
      new URL(input); // Throws an exception if `input` is not a URL
      return YouTube.getVideo(input);
    } catch (e) {
      return YouTube.searchOne(input, "video");
    }
  }

  /**
   * Search multiple youtube song by name
   *
   * @param inputs
   *
   * @returns
   */
  static async getSongs(inputs: string[]): Promise<Video[]> {
    const results = await Promise.all(
      inputs.map((input) => YouTube.searchOne(input, "video"))
    );
    return _.compact(results);
  }

  /**
   * Search youtube playlist by name or URL
   *
   * @param input
   * @param options
   * @returns
   */
  static async getPlaylist(input: string): Promise<Playlist | undefined> {
    let playlistUrl;

    try {
      new URL(input); // Throws an exception if `input` is not a URL
      playlistUrl = input;
    } catch (e) {
      const playlist = await YouTube.searchOne(input, "playlist");
      if (!playlist?.url) {
        return;
      }
      playlistUrl = playlist.url;
    }

    return YouTube.getPlaylist(playlistUrl, { fetchAll: true });
  }
}

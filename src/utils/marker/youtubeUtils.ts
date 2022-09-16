export function parseYoutubeSource(source: string): string {
    let videoId = '';
    if (source?.indexOf('watch?v=') >= 0) {
        videoId = source?.split('watch?v=')[1];
    } else if (source?.indexOf('youtu.be/') >= 0) {
        videoId = source?.split('youtu.be/')[1];
    } else {
        videoId = source;
    }
    if (videoId?.indexOf('?t=') >= 0) {
        videoId = videoId.split('?t=')[0];
    }
    if (videoId?.indexOf('&t=') >= 0) {
        videoId = videoId.split('&t=')[0];
    }
    return videoId;
}

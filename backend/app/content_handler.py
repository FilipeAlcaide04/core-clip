""" In this script we are going to handle everything related to content"""
from filter_url import filter_yt_url
from youtube_transcript_api import YouTubeTranscriptApi as yt


def get_transcript(link: str):

    link = filter_yt_url(link)

    try:
        # Get the transcript (returns a list of dicts)
        transcript = yt.get_transcript(link)
        
        # Combine all text segments into one string
        full_transcript = " ".join([segment['text'] for segment in transcript])
        
        print(full_transcript)
        
    except Exception as e:
        print(f"Could not get transcript: {e}")





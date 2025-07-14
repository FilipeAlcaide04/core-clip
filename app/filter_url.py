from urllib.parse import urlparse, parse_qs

def filter_yt_url(link: str) -> str:
    """
    Filters the id of the youtube video based on the link
    """

    # Parse the link in shorter strings hostname query etc :)
    parsed_url = urlparse(link)

    # Normal URL
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        query = parse_qs(parsed_url.query)
        return query.get("v", [None])[0]

    # Short URL
    if parsed_url.hostname == "youtu.be":
        return parsed_url.path.strip("/")

    return None

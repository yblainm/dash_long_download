import logging
from collections.abc import Callable
from itertools import islice
from math import ceil

from diskcache import Cache

import dash_download
from dash import Dash, callback, html, Input, Output, DiskcacheManager

app = Dash(__name__)
background_callback_manager=DiskcacheManager(Cache("./cache"))

filename = "test.txt"
data = "a"*500*10**6
chunk_size = 100*10**6
num_chunks = int(ceil(len(data) / chunk_size))

app.layout = html.Div(
    [
        dash_download.Download(
            id="dl",
            base64=False,
            end=num_chunks-1,
        ),
        html.Button(id="btn", children="Download"),
    ]
)

logger = logging.getLogger('DL Logger')
logger.setLevel(logging.DEBUG)
fh = logging.FileHandler('LOGS.txt')
fh.setLevel(logging.DEBUG)
logger.addHandler(fh)


def batched(iterable, n):
    "Batch data into tuples of length n. The last batch may be shorter."
    # batched('ABCDEFG', 3) --> ABC DEF G
    if n < 1:
        raise ValueError('n must be at least one')
    it = iter(iterable)
    while (batch := tuple(islice(it, n))):
        yield batch


@callback(
    Input("btn", "n_clicks"),
    prevent_initial_call=True,
    background=True,
    manager=background_callback_manager,
    progress=[Output("dl", "data")],
    running=[(Output("btn","disabled"), True, False)]
)
def download(set_progress: Callable, n_clicks: int):
    logger.log(logging.DEBUG, f"Downloading file {filename} with {num_chunks} chunks each of size {chunk_size / 10**6}MB.")
    try:
        for i, chunk in enumerate(batched(data, chunk_size)):
            chunk = "".join(chunk)
            logger.log(logging.DEBUG, f"Writing chunk {i} with length {len(chunk) / 10**6}MB and type {type(chunk)}")
            _data = {
                "filename": filename,
                "idx": i,
                "content": chunk,
            }
            set_progress(_data)
    except Exception as e:
        logger.log(logging.ERROR, e)
        raise e
    return


if __name__ == "__main__":
    app.run(debug=True)

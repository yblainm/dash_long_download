from math import ceil

import dash

import dash_download
from dash import Dash, callback, html, Input, Output, no_update

app = Dash(__name__)

app.layout = html.Div(
    [
        dash_download.Download(
            id="dl",
            base64=False,
        ),
        html.Button(id="btn", children="Download"),
    ]
)


def batched(data, batch_size):
    for i in range(0, len(data), batch_size):
        yield data[i:i + batch_size]


filename = "test.txt"
data = "a" * 500 * 10 ** 6
chunk_size = 50 * 10 ** 6
num_chunks = int(ceil(len(data) / chunk_size))

@callback(
    Output("dl", "data"),
    Input("btn", "n_clicks"),
    Input("dl", "next_chunk"),
    prevent_initial_call=True,
)
def download(n_clicks: int, next_chunk: bool):
    print(f"Downloading file {filename} with {num_chunks} chunks each of size {chunk_size / 10**6}MB.")
    triggered = dash.callback_context.triggered_id
    if triggered == "btn":
        download.batcher = enumerate(list(batched(data, chunk_size)))
        print(download.batcher)

    try:
        index, chunk = next(download.batcher)

        print( f"Writing chunk {index} with length {len(chunk) / 10**6}MB and type {type(chunk)}")

        _data = {
            "filename": filename,
            "first": index == 0,
            "last": index == num_chunks - 1,
            "content": chunk,
        }
        return _data
    except StopIteration:
        return no_update

download.batcher = None


if __name__ == "__main__":
    app.run(debug=True)

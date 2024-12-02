# Long Download

This component allows downloading large files by chunking them between several callbacks, using [native-file-system-adapter](https://github.com/jimmywarting/native-file-system-adapter) under the hood.

This project currently does not account for errors nor edge cases and lacks testing.

## Todo
- [x] Basic functionality
- [ ] Handle edge cases (e.g. user closes dialog box)
- [ ] Support for specifying MIME type
- [ ] Tests

## Usage
See [usage.py](./usage.py).

```
import dash_download
...
dash_download.Download(
    id="<id>",
    ...
)
```

The main download logic should go in a circular callback with
```
Output("dl", "data"),
Input("dl", "next_chunk"),
```
where `data` is much like the regular `dcc.Download` component, but where the `data` prop
should be given `first` and `last` equal to `True` if it is the first or last chunk.

The callback for `next_chunk` will happen automatically when the previous chunk has downloaded.

When handling the callback after sending the last chunk, return `no_update`.

## Demo
1. Build
    ```
    $ npm run build
    ```
2. Run and modify the `usage.py` sample dash app:
    ```
    $ python usage.py
    ```
3. Visit http://localhost:8050 in your web browser

## Development

### Install dependencies

If you have selected install_dependencies during the prompt, you can skip this part.

1. Install npm packages
    ```
    $ npm install
    ```
2. Create a virtual env and activate.
    ```
    $ virtualenv venv
    $ . venv/bin/activate
    ```
    _Note: venv\Scripts\activate for windows_

3. Install python packages required to build components.
    ```
    $ pip install -r requirements.txt
    ```
4. Install the python packages for testing (optional)
    ```
    $ pip install -r tests/requirements.txt
    ```

## Build

1. Build your code:
    ```
    $ npm run build
    ```
2. Create a Python distribution
    ```
    $ python setup.py sdist bdist_wheel
    ```
    This will create source and wheel distribution in the generated the `dist/` folder.
    See [PyPA](https://packaging.python.org/guides/distributing-packages-using-setuptools/#packaging-your-project)
    for more information.

3. Test your tarball by copying it into a new environment and installing it locally:
    ```
    $ pip install dash_download-0.0.1.tar.gz
    ```

This component is based on the [dash-component-boilerplate](https://github.com/plotly/dash-component-boilerplate/tree/master) cookiecutter.

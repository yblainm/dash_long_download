import PropTypes from 'prop-types';
import {Component} from 'react';
import {toByteArray} from 'base64-js';
import {showSaveFilePicker} from 'native-file-system-adapter';


const getValue = (src, fallback, key) =>
    key in src ? src[key] : fallback[key];

export default class Download extends Component {
    render() {
        return null;
    }

    async componentDidUpdate(prevProps) {
        const {id, data} = this.props;
        // If the data hasn't changed, do nothing.
        if (!data || data === prevProps.data) {
            return;
        }
        // Extract options from data if provided, fallback to props.
        // const type = getValue(data, this.props, 'type');
        const base64 = getValue(data, this.props, 'base64');
        const first = data.first;
        const last = data.last;

        if(first){
            this.fileHandle = await showSaveFilePicker(
                {
                    suggestedName: data.filename,
                    _preferPolyfill: true
                },
            );
            this.writable = await this.fileHandle.createWritable();
            this.writer = this.writable.getWriter()
        }

        // Invoke the download using a Blob.
        const content = base64 ? toByteArray(data.content) : data.content;
        const blob = new Blob([content]);

        if(this.fileHandle && this.writer){
            // this.writer.write({
            //     type: 'write',
            //     data: blob,
            // });
            this.writer.write(blob)
        }

        if(last){
            this.writer.close();
            this.fileHandle = null;
            this.writable = null;
            this.writer = null;
        }
        else {
            window.dash_clientside.set_props(id, {next_chunk: !this.props.next_chunk});
        }
    }
}

Download.propTypes = {
    /**
     * The ID of this component, used to identify dash components in callbacks.
     */
    id: PropTypes.string,

    /**
     * A bool toggled to trigger a Dash callback for the next download chunk.
     */
    next_chunk: PropTypes.bool,

    /**
     * On change, a download is invoked.
     */
    data: PropTypes.exact({
        /**
         * Suggested filename in the download dialogue.
         */
        filename: PropTypes.string.isRequired,
        /**
         * File content for a given chunk.
         */
        content: PropTypes.string.isRequired,
        /**
         * Is it the first chunk.
         */
        first: PropTypes.bool.isRequired,
        /**
         * Is it the last chunk.
         */
        last: PropTypes.bool.isRequired,
        /**
         * Set to true, when data is base64 encoded.
         */
        base64: PropTypes.bool,
        /**
         * Blob type, usually a MIME-type.
         */
        type: PropTypes.string,
    }),

    /**
     * Default value for base64, used when not set as part of the data property.
     */
    base64: PropTypes.bool,

    /**
     * Default value for type, used when not set as part of the data property.
     */
    type: PropTypes.string,

    /**
     * Dash-supplied function for updating props.
     */
    setProps: PropTypes.func,
};

Download.defaultProps = {
    type: 'text/plain',
    base64: false,
};

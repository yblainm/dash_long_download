import PropTypes from 'prop-types';
import {Component} from 'react';
import {toByteArray} from 'base64-js';
import {showSaveFilePicker} from 'native-file-system-adapter';
// import {streamSaver} from 'streamsaver'
// import {WritableStream} from "web-streams-polyfill";


const getValue = (src, fallback, key) =>
    key in src ? src[key] : fallback[key];

export default class Download extends Component {
    render() {
        return null;
    }
    componentDidMount() {
        const len = this.props.end - 1
        this.chunks = new Array(len);
        this.acc = 0;
    }

    async componentDidUpdate(prevProps) {
        const {data} = this.props;
        // If the data hasn't changed, do nothing.
        if (!data || data === prevProps.data) {
            return;
        }
        // Extract options from data if provided, fallback to props.
        // const type = getValue(data, this.props, 'type');
        const base64 = getValue(data, this.props, 'base64');
        const idx = data.idx;

        console.log("Received number ", this.acc, "Actual index ", idx);
        if (idx === 0 && this.acc === 0) {
            this.fileHandle = await showSaveFilePicker({
                _preferPolyfill: false,
                suggestedName: data.filename,
            });
        }

        // Invoke the download using a Blob.
        const content = base64 ? toByteArray(data.content) : data.content;
        const blob = new Blob([content]);

        this.chunks.splice(idx, 0, blob);
        this.acc++;

        if(this.acc === this.props.end){
            if(!this.fileHandle){
                await new Promise(r => setTimeout(r, 10000))
                if(!this.fileHandle){ return; }
            }
            console.log(this.fileHandle)
            const writer = await this.fileHandle.createWritable();
            for (const bl of this.chunks){
                console.log("writing")
                await writer.write({
                    type: 'write',
                    data: bl,
                });
                console.log("wrote")
            }
            await writer.close();
        }
                // (
                // (length) ?
                // this.streamSaver.createWriteStream(data.filename) :
                // this.streamSaver.createWriteStream(
                //     data.filename,
                //     {
                //         size: length,
                //     }
                // )).getWriter()
        // }
    }
}

Download.propTypes = {
    /**
     * The ID of this component, used to identify dash components in callbacks.
     */
    id: PropTypes.string,

    /**
     * Final chunk index.
     */
    end: PropTypes.number.isRequired,

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
         * Current chunk index.
         */
        idx: PropTypes.number.isRequired,
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

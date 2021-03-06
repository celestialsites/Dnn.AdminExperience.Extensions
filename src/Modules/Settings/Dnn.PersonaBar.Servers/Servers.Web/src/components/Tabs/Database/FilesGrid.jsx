import React, {Component, PropTypes } from "react";
import GridCell from "dnn-grid-cell";
import Localization from "../../../localization";
import util from "../../../utils";
import OverflowText from "dnn-text-overflow-wrapper";

export default class FilesGrid extends Component {

    getFilesGridRows() {
        if (this.props.files && this.props.files.length > 0) {
            const rows = this.props.files.map((field) => {
                return <div className="row">
                    <GridCell columnSize={30}><OverflowText text={field.name} /></GridCell>
                    <GridCell columnSize={15}>{util.formatNumeric2Decimals(field.size)} Mb</GridCell>
                    <GridCell columnSize={15}>{field.fileType}</GridCell>
                    <GridCell columnSize={40}><OverflowText text={field.fileName} maxWidth={290} /></GridCell>
                </div>;
            });
            return rows;
        }
        return false;
    }

    render() {
        const rows = this.getFilesGridRows();

        return <div className="grid">
            <div className="row header">
                <GridCell columnSize={30}>{Localization.get("Name")}</GridCell>
                <GridCell columnSize={15}>{Localization.get("Size")}</GridCell>
                <GridCell columnSize={15}>{Localization.get("FileType")}</GridCell>
                <GridCell columnSize={40}>{Localization.get("FileName")}</GridCell>
            </div>
            {rows}
        </div>;
    }
}

FilesGrid.propTypes = {   
    files: PropTypes.array
};
import {WindRoseConfig} from "../config/WindRoseConfig";
import {DimensionConfig} from "./DimensionConfig";
import {WindRoseDimensionCalculator} from "./WindRoseDimensionCalculator";
import {SvgUtil} from "./SvgUtil";
import {Coordinate} from "./Coordinate";
import {TextAttributes} from "./TextAttributes";
import {EntityState} from "../entity-state-processing/EntityState";
import {CornerInfo} from "../config/CornerInfo";
import SVG, {Svg} from "@svgdotjs/svg.js";
import {round} from "custom-card-helpers";

export class InfoCornersRenderer {

    private readonly dimensionCalculator: WindRoseDimensionCalculator;
    private svgUtil!: SvgUtil;

    private leftTopCoor: Coordinate;
    private rightTopCoor: Coordinate;
    private rightBottomCoor: Coordinate;
    private leftBottomCoor: Coordinate;

    private leftTopConfig: CornerInfo;
    private rightTopConfig: CornerInfo;
    private leftBottomConfig: CornerInfo;
    private rightBottomConfig: CornerInfo;

    private leftTopelement!: SVG.Text;
    private rightTopElement!: SVG.Text;
    private leftBottomElement!: SVG.Text;
    private rightBottomElement!: SVG.Text;

    constructor(config: WindRoseConfig, dimensionConfig: DimensionConfig, svg: Svg) {

        this.dimensionCalculator = new WindRoseDimensionCalculator(dimensionConfig);
        this.svgUtil = new SvgUtil(svg);

        this.leftTopCoor = this.dimensionCalculator.infoCornerLeftTop();
        this.rightTopCoor = this.dimensionCalculator.infoCornerRightTop();
        this.leftBottomCoor = this.dimensionCalculator.infoCornetLeftBottom();
        this.rightBottomCoor = this.dimensionCalculator.infoCornetRightBottom();

        this.leftTopConfig = config.cornersInfo.topLeftInfo;
        this.rightTopConfig = config.cornersInfo.topRightInfo;
        this.leftBottomConfig = config.cornersInfo.bottomLeftInfo;
        this.rightBottomConfig = config.cornersInfo.bottomRightInfo;
    }

    drawCornerLabel() {
        if (this.leftTopConfig.label) {
            const leftTop = this.svgUtil.drawText(this.dimensionCalculator.infoCornerLabelLeftTop(), this.leftTopConfig.label,
                TextAttributes.infoCornerLabelAttribute(this.leftTopConfig.color));
            leftTop.attr({"text-anchor": "left", "dominant-baseline": "hanging"});
        }
        if (this.rightTopConfig.label) {
            const leftTop = this.svgUtil.drawText(this.dimensionCalculator.infoCornerLabelRightTop(), this.rightTopConfig.label,
                TextAttributes.infoCornerLabelAttribute(this.rightTopConfig.color));
            leftTop.attr({"text-anchor": "end", "dominant-baseline": "hanging"});
        }
        if (this.leftBottomConfig.label) {
            const leftBottom = this.svgUtil.drawText(this.dimensionCalculator.infoCornetLabelLeftBottom(), this.leftBottomConfig.label,
                TextAttributes.infoCornerLabelAttribute(this.leftBottomConfig.color));
            leftBottom.attr({"text-anchor": "left", "dominant-baseline": "hanging"});
        }
        if (this.rightBottomConfig.label) {
            const rightBottom = this.svgUtil.drawText(this.dimensionCalculator.infoCornetLabelRightBottom(), this.rightBottomConfig.label,
                TextAttributes.infoCornerLabelAttribute(this.rightBottomConfig.color));
            rightBottom.attr({"text-anchor": "end", "dominant-baseline": "hanging"});
        }
    }

    drawCornerValues(entityStates: EntityState[]) {

        if (this.leftTopConfig.show && entityStates[0].active) {
            this.leftTopelement = this.svgUtil.drawText(this.leftTopCoor,
                this.getText(entityStates[0], this.leftTopConfig),
                TextAttributes.infoCornerAttribute(this.leftTopConfig.color));
            this.leftTopelement.attr({"text-anchor": "left", "dominant-baseline": "hanging"});
        }
        if (entityStates[1].active) {
            this.rightTopElement = this.svgUtil.drawText(this.rightTopCoor,
                this.getText(entityStates[1], this.rightTopConfig),
                TextAttributes.infoCornerAttribute(this.rightTopConfig.color));
            this.rightTopElement.attr({"text-anchor": "end", "dominant-baseline": "hanging"});
        }
        if (entityStates[2].active) {
            this.leftBottomElement = this.svgUtil.drawText(this.leftBottomCoor,
                this.getText(entityStates[2], this.leftBottomConfig),
                TextAttributes.infoCornerAttribute(this.leftBottomConfig.color));
            this.leftBottomElement.attr({"text-anchor": "left", "dominant-baseline": "auto"});
        }
        if (entityStates[3].active) {
            this.rightBottomElement = this.svgUtil.drawText(this.rightBottomCoor,
                this.getText(entityStates[3], this.rightBottomConfig),
                TextAttributes.infoCornerAttribute(this.rightBottomConfig.color));
            this.rightBottomElement.attr({"text-anchor": "end", "dominant-baseline": "auto"});
        }
    }

    updateCornerValues(entityStates: EntityState[]) {
        this.leftTopelement?.remove();
        this.rightTopElement?.remove();
        this.leftBottomElement?.remove();
        this.rightBottomElement?.remove();
        this.drawCornerValues(entityStates);
    }

    private getText(entityState: EntityState, config: CornerInfo): string {
        if (entityState === undefined || entityState === null) {
            return "";
        }
        let stateValue = entityState.state;
        if (!isNaN(+entityState.state!) && !isNaN(config.precision!)) {
            stateValue = '' + round(+entityState.state!, config.precision);
        }
        if (config.unit) {
            return stateValue + config.unit;
        }
        return stateValue!;
    }

}

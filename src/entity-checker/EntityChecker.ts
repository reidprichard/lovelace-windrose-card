import {CardConfigWrapper} from "../config/CardConfigWrapper";
import {HomeAssistant} from "custom-card-helpers";
import {CornerInfo} from "../config/CornerInfo";

export class EntityChecker {

    private hass!: HomeAssistant;

    public checkEntities(cardConfig: CardConfigWrapper, hass: HomeAssistant) {

        this.checkEntity(cardConfig.windDirectionEntity.entity, hass);

        for (const entity of cardConfig.windspeedEntities) {
            this.checkEntity(entity.entity, hass);
            if (entity.speedUnit === 'auto' && hass.states[entity.entity].attributes.unit_of_measurement !== undefined) {
                entity.speedUnit = hass.states[entity.entity].attributes.unit_of_measurement as string;
            }
        }

        if (cardConfig.compassConfig && cardConfig.compassConfig.autoRotate && cardConfig.compassConfig.entity) {
            this.checkEntity(cardConfig.compassConfig.entity, hass);
        }

        this.checkCornerInfo(cardConfig.cornersInfo.topLeftInfo, hass);
        this.checkCornerInfo(cardConfig.cornersInfo.topRightInfo, hass);
        this.checkCornerInfo(cardConfig.cornersInfo.bottomLeftInfo, hass);
        this.checkCornerInfo(cardConfig.cornersInfo.bottomRightInfo, hass);
    }

    private checkCornerInfo(cornerInfo: CornerInfo, hass: HomeAssistant) {
        if (cornerInfo.show && cornerInfo.entity) {
            this.checkEntity(cornerInfo.entity, hass);
        }
    }

    private checkEntity(entity: string, hass: HomeAssistant) {
        if (hass.states[entity] === undefined) {
            throw new Error(`Entity ${entity} not found.`);
        }
    }
}

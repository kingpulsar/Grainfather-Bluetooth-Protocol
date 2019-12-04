module.exports = class GrainfatherCommands {

    constructor() {
        this.dismissBoilAdditionAlert = 'A';
        this.cancelTimer = 'C';
        this.decrementTargetTemp = 'D';
        this.cancelOrFinishSession = 'F';
        this.pauseOrResumeTimer = 'G';
        this.toggleHeat = 'H';
        this.interactionComplete = 'I';
        this.turnOffHeat = 'K0';
        this.turnOnHeat = 'K1';
        this.turnOffPump = 'L0';
        this.turnOnPump = 'L1';
        this.getCurrentBoilTemp = 'M';
        this.togglePump = 'P';
        this.disconnectManualModeNoAction = 'Q0';
        this.disconnectAndCancelSession = 'Q1';
        this.disconnectAutoModeNoAction = 'Q2';
        this.pressSet = 'T';
        this.incrementTargetTemp = 'U';
        this.disableSpargeWaterAlert = 'V';
        this.getFirmwareVersion = 'X';
        this.resetController = 'Z';
        this.resetRecipeInterrupted = '!';
        this.turnOffSpargeCounterMode = 'd0';
        this.turnOnSpargeCounterMode = 'd1';
        this.turnOffBoilControlMode = 'e0';
        this.turnOnBoilControlMode = 'e1';
        this.exitManualPowerControlMode = 'f0';
        this.enterManualPowerControlMode = 'f1';
        this.getControllerVoltageAndUnits = 'g';
        this.turnOffSpargeAlertMode = 'h0';
        this.turnOnSpargeAlertMode = 'h1';
    }

    getDismissBoilAdditionAlert() {
        return this.dismissBoilAdditionAlert;
    }

    getCancelTimer() {
        return this.cancelTimer;
    }

    getDecrementTargetTemp() {
        return this.decrementTargetTemp;
    }

    getCancelOrFinishSession() {
        return this.cancelOrFinishSession;
    }

    getPauseOrResumeTimer() {
        return this.pauseOrResumeTimer;
    }

    getToggleHeat() {
        return this.toggleHeat;
    }

    getInteractionComplete() {
        return this.interactionComplete;
    }

    getTurnOffHeat() {
        return this.turnOffHeat;
    }

    getTurnOnHeat() {
        return this.turnOnHeat;
    }

    getTurnOffPump() {
        return this.turnOffPump;
    }

    getTurnOnPump() {
        return this.turnOnPump;
    }

    getGetCurrentBoilTemp() {
        return this.getCurrentBoilTemp;
    }

    getTogglePump() {
        return this.togglePump;
    }

    getDisconnectManualModeNoAction() {
        return this.disconnectManualModeNoAction;
    }

    getDisconnectAndCancelSession() {
        return this.disconnectAndCancelSession;
    }

    getDisconnectAutoModeNoAction() {
        return this.disconnectAutoModeNoAction;
    }

    getPressSet() {
        return this.pressSet;
    }

    getIncrementTargetTemp() {
        return this.incrementTargetTemp;
    }

    getDisableSpargeWaterAlert() {
        return this.disableSpargeWaterAlert;
    }

    getGetFirmwareVersion() {
        return this.getFirmwareVersion;
    }

    getResetController() {
        return this.resetController;
    }

    getResetRecipeInterrupted() {
        return this.resetRecipeInterrupted;
    }

    getTurnOffSpargeCounterMode() {
        return this.turnOffSpargeCounterMode;
    }

    getTurnOnSpargeCounterMode() {
        return this.turnOnSpargeCounterMode;
    }

    getTurnOffBoilControlMode() {
        return this.turnOffBoilControlMode;
    }

    getTurnOnBoilControlMode() {
        return this.turnOnBoilControlMode;
    }

    getExitManualPowerControlMode() {
        return this.exitManualPowerControlMode;
    }

    getEnterManualPowerControlMode() {
        return this.enterManualPowerControlMode;
    }

    getGetControllerVoltageAndUnits() {
        return this.getControllerVoltageAndUnits;
    }

    getTurnOffSpargeAlertMode() {
        return this.turnOffSpargeAlertMode;
    }

    getTurnOnSpargeAlertMode() {
        return this.turnOnSpargeAlertMode;
    }

    getSetDelayedHeatFunction(minutes, seconds) {
        return `B${minutes},${seconds},`;
    }

    getSetLocalBoilTempTo(temperature) {
        return `E${temperature},`;
    }

    getSetBoilTimeTo(minutes) {
        return `J${minutes},`;
    }

    getSkipToStep(stepNum, canEditTime, timeLeftMin, timeLeftSec, skipRamp, disableAddGrain) {
        return `N${stepNum},${canEditTime},${timeLeftMin},${timeLeftSec},${skipRamp},${disableAddGrain},`;
    }

    getSetNewTimer(minutes) {
        return `S${minutes},`;
    }

    getSetNewTimerWithSeconds(minutes, seconds) {
        return `W${minutes},${seconds},`;
    }

    getSetTargetTempTo(temperature) {
        return `$${temperature},`;
    }

    getEditControllerStoredTempAndTime(stageNum, newTime, newTemperature) {
        return `a${stageNum},${newTime},${newTemperature},`;
    }

    getSetSpargeProgressTo(progress) {
        return `b$${progress},`;
    }

    getSkipToInteraction(code) {
        return `c${code},`;
    }

    getRecipeCommands(boilTime, mashSteps, mashVolume, spargeVolume, showWaterTreatmentAlert, showSpargeCounter, showSpargeAlert, delayedSession, skipStart, name, hopStandTime, boilAdditions, boilPowerMode, strikeTempMode) {
        let commands = [];

        commands.push(`R${boilTime},${mashSteps.length},${mashVolume},${spargeVolume},`);
        commands.push(`${showWaterTreatmentAlert},${showSpargeCounter},${showSpargeAlert},${delayedSession},${skipStart},`);
        commands.push(`${name}`);
        commands.push(`${hopStandTime},${Object.keys(boilAdditions).length},${boilPowerMode},${strikeTempMode},`);

        for (const stop of boilAdditions) {
            commands.push(stop.toString());
        }

        if (strikeTempMode) {
            commands.push('0');
        }

        for (let mashStep of mashSteps) {
            commands.push(`${mashStep[0]}:${mashStep[1]}`);
        }

        return commands;
    }

    parseNotification(notification)
    {
        let parsedNotification = {};
        const components = notification.substring(1).split(',').slice(0, -1);
        const type = notification[0];

        switch (type) {
            case 'X':
                parsedNotification = {
                    targetTemperature: Math.min(parseFloat(components[0]), 100),
                    currentTemperature: Math.min(parseFloat(components[1]), 100),
                };
                break;

            case 'Y':
                parsedNotification = {
                    heatPower: components[0],
                    pumpStatus: components[1],
                    autoModeStatus: components[2],
                    stageRampStatus: components[3],
                    interactionModeStatus: components[4],
                    interactionCode: components[5],
                    stageNumber: parseInt(components[6], 10),
                    delayedHeatMode: components[7],
                };
                break;

            case 'T':
                parsedNotification = {
                    timerActive: components[0],
                    timeLeftMinutes: parseInt(components[1], 10),
                    timerTotalStartTime: parseInt(components[2], 10),
                    timeLeftSeconds: parseInt(components[3], 10),
                };
                break;

            case 'I':
                parsedNotification = {
                    interactionCode: components[0],
                };
                break;

            case 'W':
                parsedNotification = {
                    ...parsedNotification,
                    heatPowerOutputPercentage: parseInt(components[0], 10),
                    isTimerPaused: components[1],
                    stepMashMode: components[2],
                    isRecipeInterrupted: components[3],
                    manualPowerMode: components[4],
                    spargeWaterAlertDisplayed: components[5],
                };
                break;

            case 'C':
                parsedNotification = {
                    boilTemperature: parseFloat(components[0]),
                };
                break;

            default:
                return;
        }

        return {type: type, ...parsedNotification};
    }

}

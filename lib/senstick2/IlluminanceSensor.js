'use strict';

// 照度センササービス
var SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID       = 'f000210304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR   = 'f000710304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR        = 'f000720304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_TARGET_LOGID_CHAR         = 'f000730304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_LOGMETADATA_CHAR          = 'f000740304514000b000000000000000';
var SENSTICK2_ILLUMINANCE_LOGDATA_CHAR              = 'f000750304514000b000000000000000';

var SenStick2SensorService = require('./SensorService');

/**
 * SenStick2IlluminanceSensorServiceは，照度センサのセンシング及びロギングの動作指定，リアルタイムのセンサデータ読み出し，及びログデータの
 * 読み出し機能を提供する.
 * @mixin
 */
function SenStick2IlluminanceSensorService()
{
}

/**
 * 照度センサの計測動作を取得する
 * @param {readIlluminanceMeasurementConfigCallback}    callback    - コールバック関数
**/
SenStick2IlluminanceSensorService.prototype.readIlluminanceMeasurementConfig = function(callback)
{
    this.readMeasurementConfig(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 照度センサの計測動作を取得した際に呼び出されるコールバック関数．
 * @callback readIlluminanceMeasurementConfigCallback
 * @param {?string}                         error               - エラー内容．エラーが無ければnull．
 * @param {SensorOperationMode|undefined}   operation_mode      - 動作モード．
 * @param {number|undefined}                sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number|undefined}                measurement_range   - 照度センサの測定レンジ．
 */

/**
 * 照度センサの計測動作を設定する
 * @param {SensorOperationMode} operation_mode      - 動作モード．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {number}              measurement_range   - 照度センサの測定レンジ．
 * @param {callback}            callback            - コールバック関数．
**/
SenStick2IlluminanceSensorService.prototype.writeIlluminanceMeasurementConfig = function(operation_mode, sampling_period, measurement_range, callback)
{
    this.writeMeasurementConfig(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        operation_mode,
        sampling_period,
        measurement_range,
        callback
    );
};

/**
 * 照度センサを有効にする．
 * @param {boolean}             logging_flag        - ロギングの有効・無効を表すフラグ．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2IlluminanceSensorService.prototype.enableIlluminanceSensor = function(logging_flag, callback)
{
    this.enableSensor(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        logging_flag,
        callback
        );
};

/**
 * 照度センサを無効にする．
 * @param {callback}            callback            - コールバック関数．
*/
SenStick2IlluminanceSensorService.prototype.disableIlluminanceSensor = function(callback)
{
    this.disableSensor(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        callback
    );
};

/**
 * 照度センサのサンプル周期を設定する．
 * @param {number}              sampling_period     - ミリ秒単位のサンプル周期．
 * @param {callback}            callback            - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.writeIlluminanceSamplingPeriod = function(sampling_period, callback)
{
    this.writeSensorSamplingPeriod(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        sampling_period,
        callback
    );
};


/**
 * 照度センサの測定レンジを設定する．
 * @param {number}      measurement_range       - 照度センサの測定レンジ．
 * @param {callback}    callback                - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.writeIlluminanceMeasurementRange = function(measurement_range, callback)
{
    this.writeSensorMeasurementRange(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_MEASUREMENT_CONFIG_CHAR,
        measurement_range,
        callback
    );
};

/**
 * 照度センサのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.notifyIlluminance = function(callback)
{
    this.onIlluminanceChangeBinded = this.onIlluminanceChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR,
        true,
        this.onIlluminanceChangeBinded,
        callback
    );
};

/**
 * 照度センサのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.unnotifyIlluminance = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_REALTIME_DATA_CHAR,
        false,
        this.onIlluminanceChangeBinded,
        callback
    );
};

/**
 * notificationで送られてきた照度センサデータをリスナに送る．
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}    data - 受信したデータ．
 * @fires SenStick2IlluminanceSensorService#illuminanceChange
 * @private
 */
SenStick2IlluminanceSensorService.prototype.onIlluminanceChange = function(data)
{
    /**
     * illuminanceChange イベント．
     * @event SenStick2AccelerometerSensorService#accelerometerChange
     * @param {number} illuminance - 照度．
     */
    this.emit('illuminanceChange', data.readUInt16LE(0));
};

/**
 * 照度センサの読み出し対象のログIDを指定する．
 * @param {number}      target_log_id   - 読み出し対象のログID．
 * @param {number}      start_position  - 読み出し開始位置をサンプル数単位で指定する．
 * @param {callback}    callback        - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.writeIlluminanceLogReadoutTargetID = function(target_log_id, start_position, callback)
{
    this.writeSensorLogReadoutTargetID(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_TARGET_LOGID_CHAR,
        target_log_id,
        start_position,
        callback
    );
};

/**
 * 照度センサのログメタデータを取得する．
 * <b>このメソッドを呼び出す前に，writeIlluminanceLogReadoutTargetIDで対象ログIDをSenStickに送信する必要がある．</b>
 * <b>SenStickの仕様上，このメソッドを呼び出すと，ログデータがnotificaitonで送られてくる．そのため，notificationを受信する
 *              するようにしている場合，ログデータが必要なければnotificationを無視すること．</b>
 * @param {readIlluminanceLogMetaDataCallback}    callback - コールバック関数
 */
SenStick2SensorService.prototype.readIlluminanceLogMetaData = function(callback)
{
    this.readSensorLogMetaData(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGMETADATA_CHAR,
        callback
    );
};

/**
 * 照度センサのログメタデータを取得した際に呼び出されるコールバック関数．
 * @callback readIlluminanceLogMetaDataCallback
 * @param {?string}             error               - エラー内容．エラーが無ければnull．
 * @param {number|undefined}    target_log_id       - 読み出し対象のログID．
 * @param {number|undefined}    sampling_period     - このログのミリ秒単位のサンプリング周期．
 * @param {number|undefined}    measurement_range   - このログの測定レンジ．
 * @param {number|undefined}    number_of_samples   - このログに含まれるセンサデータの数．number_of_samplesはサンプル数単位で表される．
 * @param {number|undefined}    reading_position    - このログの現在の読み出し位置．reading_positionはサンプル数単位で表される．
 * @param {number|undefined}    remaining_storage   - 照度センササービスのストレージの残量．remaining_storageはサンプル数単位で表される．
 */

/**
 * 照度センサのログデータの読み出しを開始する
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
/*SenStick2IlluminanceSensorService.prototype.startReadoutIlluminanceLog = function(target_log_id, start_position, callback)
{
    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error) return callback(error);
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                callback
            );
        }.bind(this)
    );
};*/

/**
 * 照度センサのログデータの読み出しをする
 * @param       target_log_id           読み出し対象のログID
 * @param       start_position          読み出し開始位置をサンプル数単位で指定する
 * @param       callback                コールバック関数
 *                                      callbackはfunction(error)の形を取る
 */
/*SenStick2IlluminanceSensorService.prototype.startReadoutIlluminanceLog = function(target_log_id, start_position, callback)
{
    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error) return callback(error);
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                callback
            );
        }.bind(this)
    );
};*/

/**
 * 照度センサのログデータを取得する
 */
/*
SenStick2IlluminanceSensorService.prototype.readIlluminanceLogData = function(target_log_id, start_position, callback)
{
    this.onIlluminanceReadLogDataFinishedBinded = callback.bind(this);
    this.illuminance_log_data = [];

    this.notifyIlluminanceLogData(
        function(error)
        {
            if(error)
            {
                return this.unnotifyIlluminanceLogMetaData(
                    function(error_u) { if(error_u) { return callback(error_u + "\n" + error); } else { return callback(error); } }
                );
            }
            this.writeIlluminanceLogReadoutTargetID(
                target_log_id,
                start_position,
                function(error)
                {
                    if(error) return callback(error);
                }
            );
        }.bind(this)
    );
};
*/

/**
 * 照度センサのログデータのnotificationの受信要求を設定する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.notifyIlluminanceLogData = function(callback)
{
    this.onIlluminanceLogDataChangeBinded = this.onIlluminanceLogDataChange.bind(this);
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGDATA_CHAR,
        true,
        this.onIlluminanceLogDataChangeBinded,
        callback
    );
};

/**
 * 照度センサのログデータのnotificationの受信要求を解除する．
 * @param {callback}    callback - コールバック関数．
 */
SenStick2IlluminanceSensorService.prototype.unnotifyIlluminanceLogData = function(callback)
{
    this.notifyCharacteristic(
        SENSTICK2_ILLUMINANCE_SENSOR_SERVICE_UUID,
        SENSTICK2_ILLUMINANCE_LOGDATA_CHAR,
        false,
        this.onIlluminanceLogDataChangeBinded,
        callback
    );
};


/**
 * notificationで送られてきた照度センサログデータをリスナに送る
 * notificationを受信した際に自動的に呼び出される．
 * @param {Buffer}  data - 受信したデータ
 * @fires SenStick2IlluminanceSensorService#illuminanceLogDataReceived
 * @private
 */
SenStick2IlluminanceSensorService.prototype.onIlluminanceLogDataChange = function(data)
{
    var number_of_data = data.readUInt8(0);
    var sensor_data = [];
    for(var i = 0; i < number_of_data; i++)
    {
        sensor_data.push(data.readUInt16LE(1+i*2));
    }
    /**
     * illuminanceLogDataReceived イベント
     * @event SenStick2IlluminanceSensorService#illuminanceLogDataReceived
     * @param {number} number_of_data - sensor_dataの要素数．
     * @param {number[]} sensor_data  - 照度センサのログデータ．
     */
    this.emit('illuminanceLogDataReceived', number_of_data, sensor_data);
};

/**
 * 照度センサの測定レンジに対応する換算値を取得する．
 * 照度センサから取得した数値を物理値に変換する際に使用する．センサから取得した数値を換算値で割ることで，物理量が求まる．
 * @param {number}      range           測定レンジの値．
 * @returns {?number}   換算値．nullの場合は，対応する換算値は存在しないことを示す．
 */
SenStick2IlluminanceSensorService.prototype.getIlluminanceConversionValue = function(range)
{
    if(range == 0) return 1;
    return null;
};

module.exports = SenStick2IlluminanceSensorService;

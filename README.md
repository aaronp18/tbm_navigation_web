# Building
1) Start up the ROS bridge server
2) `npm install` to install all of the required packages
3) `cd client` -> `npm install` to install react client packages
   
# Starting
1) cd to the root directory
2) `nodemon` to start up the node server
3) `npm run client-start` to startup the react client
4) Visit `localhost:8080` for the website

# Topics, Services and Params
## Listeners
|              Name              |         Topic Name          |         Type         |         Description          |
| :----------------------------: | :-------------------------: | :------------------: | :--------------------------: |
|      **Telemetry Topics**      |
|        Cutterhead Pose         |            `/ch`            | `geometry_msgs/Pose` |     ID: `cutterheadPose`     |
|     Cutterhead Seed (RPM)      |         `/ch/speed`         |  `std_msgs/Float32`  |    ID: `cutterheadSpeed`     |
|  Cutterhead Torque (ft x lb)   |        `/ch/torque`         |  `std_msgs/Float32`  |    ID: `cutterheadTorque`    |
|        Total Thrust (N)        |        `/tbm/thrust`        |  `std_msgs/Float32`  |      ID: `totalThrust`       |
| Distance Travelled Rate (mm/s) | `/tbm/telem/distance/rate`  |  `std_msgs/Float32`  | ID: `distanceTravelledRate`  |
|  Distance Travelled Total (m)  | `/tbm/telem/distance/total` |  `std_msgs/Float32`  | ID: `distanceTravelledTotal` |
|  Energy Consumption Rate (kW)  |  `/tbm/telem/energy/rate`   |  `std_msgs/Float32`  | ID: `energyConsumptionRate`  |
| Energy Consumption Total (kWh) |  `/tbm/telem/energy/total`  |  `std_msgs/Float32`  | ID: `energyConsumptionTotal` |
|  Water Consumption Rate (L/s)  |   `/tbm/telem/water/rate`   |  `std_msgs/Float32`  |  ID: `waterConsumptionRate`  |
|  Water Consumption Total (L)   |  `/tbm/telem/water/total`   |  `std_msgs/Float32`  | ID: `waterConsumptionTotal`  |
|           TBM Status           |        `/tbm/status`        |   `std_msgs/Bool`    |           ID: `on`           |
|           Longitude            |       `/tbm/pos/long`       |  `std_msgs/Float32`  |                              |
|            Latitude            |       `/tbm/pos/lat`        |  `std_msgs/Float32`  |                              |

## Publishers
|              Name              |        Topic Name         |        Type        |                                       Description                                       |
| :----------------------------: | :-----------------------: | :----------------: | :-------------------------------------------------------------------------------------: |
|          Pitch Delta           |   `/nav/pitch/target/`    | `std_msgs/Float32` |                  The angle change required to get to the target pitch                   |
|          Target Pitch          |     `/nav/pitch/aim/`     | `std_msgs/Float32` |                                                                                         |
|         Pitch Enabled          |   `/nav/pitch/enabled/`   |  `std_msgs/Bool`   | Publishes whether the TBM should use the target pitch and or not. Toggled by the switch |
|           Yaw Delta            |    `/nav/yaw/target/`     | `std_msgs/Float32` |                   The angle change required to get to the target yaw                    |
|           Target Yaw           |      `/nav/yaw/aim/`      | `std_msgs/Float32` |                                                                                         |
|          Yaw Enabled           |    `/nav/yaw/enabled/`    |  `std_msgs/Bool`   |  Publishes whether the TBM should use the target yaw and or not. Toggled by the switch  |
|             Pitch              |     `/tbm/rot/pitch`      | `std_msgs/Float32` |                                                                                         |
|              Yaw               |      `/tbm/rot/yaw`       | `std_msgs/Float32` |                                                                                         |
|              Roll              |      `/tbm/rot/roll`      | `std_msgs/Float32` |                                                                                         |
|           Longitude            |      `/tbm/pos/long`      | `std_msgs/Float32` |                                                                                         |
|            Latitude            |      `/tbm/pos/lat`       | `std_msgs/Float32` |                                                                                         |
|               X                |       `/tbm/pos/x`        | `std_msgs/Float32` |                                                                                         |
|               Y                |       `/tbm/pos/y`        | `std_msgs/Float32` |                                                                                         |
|               Z                |       `/tbm/pos/z`        | `std_msgs/Float32` |                                                                                         |
|  Water Consumption Rate (L/s)  |  `/tbm/telem/water/rate`  | `std_msgs/Float32` |                                                                                         |
|  Water Consumption Total (L)   | `/tbm/telem/water/total`  | `std_msgs/Float32` |                                                                                         |
|  Energy Consumption Rate (kW)  | `/tbm/telem/energy/rate`  | `std_msgs/Float32` |                                                                                         |
| Energy Consumption Total (kWh) | `/tbm/telem/energy/total` | `std_msgs/Float32` |                                                                                         |
|         Current Phase          |       `/nav/phase/`       | `std_msgs/String`  |                        `launch` \| `cruise` \| `exit` \| `stop`                         |

## Params
|            Name             |             Param Name              |        Type        |                Description                |
| :-------------------------: | :---------------------------------: | :----------------: | :---------------------------------------: |
|          Max Pitch          |            `/pitch/max`             | `std_msgs/Float32` | The max target pitch the web site can set |
|          Min Pitch          |            `/pitch/min`             | `std_msgs/Float32` | The min target pitch the web site can set |
|           Max Yaw           |             `/yaw/max`              | `std_msgs/Float32` |  The max target yaw the web site can set  |
|           Min Yaw           |             `/yaw/min`              | `std_msgs/Float32` |  The min target yaw the web site can set  |
|       Origin Latitude       |            `/origin/lat`            | `std_msgs/Float32` |                                           |
|      Origin Longitude       |           `/origin/long`            | `std_msgs/Float32` |                                           |
| Energy Consumption Graph On | `/consumption/energy/graph/enabled` |  `std_msgs/Bool`   | Determines whether points are calculated  |
| Water Consumption Graph On  | `/consumption/water/graph/enabled`  |  `std_msgs/Bool`   | Determines whether points are calculated  |

# Navigation Notes
Due to time restrictions, the addition of "delta" angles (the change required to reach the target angle) has meant that on the front end everything makes sense, however now the `delta` is published to the `/nav/pitch/target` instead of `/nav/pitch/delta`. Therefore `/nav/pitch/aim` is used for the actual target angle.

This is a little confusing and so will be fixed in future revisions.

# Building
1) Start up the ROS bridge server
2) `npm install` to install all of the required packages
3) `nodemon` should start up the web server
4) Visit `ip:8080` for the website

# Topics, Services and Params
## Listeners
|     Name      |          Topic Name          |        Type        |                                         Description                                          |
| :-----------: | :--------------------------: | :----------------: | :------------------------------------------------------------------------------------------: |
| Current Pitch | `/set_angles/pitch/current/` | `std_msgs/Float32` | Listens and updates the display of the current pitch. This is rounded to 2dp for the display |
|  Current Yaw  |  `/set_angles/yaw/current/`  | `std_msgs/Float32` |                      Listens and updates the display of the current yaw                      |
|   Longitude   |   `/set_angles/longitude`    | `std_msgs/Float32` |                                                                                              |
|   Latitude    |    `/set_angles/latitude`    | `std_msgs/Float32` |                                                                                              |
|     Pitch     | `/set_angles/pitch/current`  | `std_msgs/Float32` |                                                                                              |
|    Heading    |  `/set_angles/yaw/current`   | `std_msgs/Float32` |                                                                                              |
|     Depth     |     `/set_angles/depth`      | `std_msgs/Float32` |                                                                                              |
|    Length     |     `/set_angles/length`     | `std_msgs/Float32` |                                                                                              |
## Publishers
|     Name      |          Topic Name          |        Type        |                                              Description                                               |
| :-----------: | :--------------------------: | :----------------: | :----------------------------------------------------------------------------------------------------: |
| Target Pitch  | `/set_angles/pitch/target/`  | `std_msgs/Float32` | Publishes the angle required to get to the target pitch. Is updated every time the slider is adjusted. |
| Pitch Enabled | `/set_angles/pitch/enabled/` |  `std_msgs/Bool`   |        Publishes whether the TBM should use the target pitch and or not. Toggled by the switch         |
|  Target Yaw   |  `/set_angles/yaw/target/`   | `std_msgs/Float32` | Publishes the angle required to get to the target yaw.  Is updated every time the slider is adjusted.  |
|  Yaw Enabled  |  `/set_angles/yaw/enabled/`  |  `std_msgs/Bool`   |         Publishes whether the TBM should use the target yaw and or not. Toggled by the switch          |

## Params
|   Name    |  Param Name  |        Type        |                Description                |
| :-------: | :----------: | :----------------: | :---------------------------------------: |
| Max Pitch | `/pitch/max` | `std_msgs/Float32` | The max target pitch the web site can set |
| Min Pitch | `/pitch/min` | `std_msgs/Float32` | The min target pitch the web site can set |
|  Max Yaw  |  `/yaw/max`  | `std_msgs/Float32` |  The max target yaw the web site can set  |
|  Min Yaw  |  `/yaw/min`  | `std_msgs/Float32` |  The min target yaw the web site can set  |


# Notes
Currently this uses actions rather than just publishing directly to a topic so I need to do that.

## Todo

### Web Design
- [X] Make mockup sliders
- [ ] Find / make better more optimised sliders for touch screen
- [X] Add optional buttons
- [ ] Style optional buttons
- [X] Add angle readouts
- [X] Make target angle writable?
- [ ] Add animated readout
- [ ] Screen size updates model render
- [ ] Make everything offline
- [X] Add toast for info
- [X] Toggle
- [X] Max min vals buttons
- [X] Table of depth distance lat long heading etc
- [ ] Pretty table of values
- [ ] Auto reconnect


### ROS Integration
- [X] Have target pitch adjust current pitch
- [X] Connect sliders to publish to topic (not using goals to update)
- [ ] Perhaps make all sliders synced up? (If refresh page, will want to keep current?)
- [X] Connect up angle readouts to ROS
- [ ] Allow only one target / updates with new target?
- [X] Have param for max pitch and yaw
- [X] Add infrastructure for listeners
- [X] ROs paramaters with min max
- [X] Change everything to just publish to ros topic
- [ ] Fix enable button
- [X] Publish from server
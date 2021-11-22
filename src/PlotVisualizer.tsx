/*
 * PlotVisualizer.tsx
 * Copyright: Microsoft 2019
 *
 * Visualizer app for generic plot visualizer.
 */

import {
  CompatibleVersion,
  IterationUpdateMessage,
  MessageType,
  QueryParams,
  ThemeMode,
} from "microsoft-bonsai-visualizer";
import React, { Component } from "react";
import * as semver from "semver";
import * as THREE from "three";

import { PlotModel } from "./PlotModel";
import { PlotRenderer } from "./PlotRenderer";
import { PlotVariableMenu } from "./PlotVariableMenu";

enum Axis {
  X = 0,
  Y = 1,
  Z = 2,
}

interface PlotVisualizerProps {}

interface PlotVisualizerState {
  theme: ThemeMode;
  isModelValid: boolean;
  model: PlotModel;

  // keys to use for each of the Axes
  axisKeys: (string | undefined)[];

  history: THREE.Vector3[];
  historyLimit: number;
}

export default class PlotVisualizer extends Component<
  PlotVisualizerProps,
  PlotVisualizerState
> {
  constructor(props: PlotVisualizerProps) {
    super(props);

    const queryParams = new URLSearchParams(window.location.search);
    const initialTheme = this._getInitialTheme(queryParams);

    const initialX = queryParams.get("x") as string;
    const initialY = queryParams.get("y") as string;
    const initialZ = queryParams.get("z") as string;

    this.state = {
      theme: initialTheme,
      isModelValid: true,
      model: {
        state: {},
      },
      history: [],
      historyLimit: 50,
      axisKeys: [initialX, initialY, initialZ],
    };

    //this._setAxisKey = this._setAxisKey.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener("message", this._receiveMessage);
  }

  componentWillUnmount(): void {
    window.removeEventListener("message", this._receiveMessage);
  }

  render(): JSX.Element {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            margin: 4,
            width: "100%",
          }}
        >
          <PlotVariableMenu
            label={"X:"}
            axisKey={this.state.axisKeys[Axis.X]}
            model={this.state.model}
            clickHandler={(axisKey) => {
              this._setAxisKey(Axis.X, axisKey);
            }}
          />
          <PlotVariableMenu
            label={"Y:"}
            axisKey={this.state.axisKeys[Axis.Y]}
            model={this.state.model}
            clickHandler={(axisKey) => {
              this._setAxisKey(Axis.Y, axisKey);
            }}
          />
          <PlotVariableMenu
            label={"Z:"}
            axisKey={this.state.axisKeys[Axis.Z]}
            model={this.state.model}
            clickHandler={(axisKey) => {
              this._setAxisKey(Axis.Z, axisKey);
            }}
          />
        </div>
        <PlotRenderer
          theme={this.state.theme}
          isModelValid={this.state.isModelValid}
          history={this.state.history}
        />
      </>
    );
  }

  private _setAxisKey = (axis: Axis, axisKey?: string) => {
    const prevAxisKeys = this.state.axisKeys;
    prevAxisKeys[axis] = axisKey;
    this.setState({ axisKeys: prevAxisKeys });
  };

  private _nextPoint = (): THREE.Vector3 => {
    // append the next history point
    const point = new THREE.Vector3(0, 0, 0);

    // map out the state into point
    const state = this.state.model.state;
    const xkey = this.state.axisKeys[Axis.X];
    const ykey = this.state.axisKeys[Axis.Y];
    const zkey = this.state.axisKeys[Axis.Z];

    if (xkey && state.hasOwnProperty(xkey)) point.setX(state[xkey]);
    if (ykey && state.hasOwnProperty(ykey)) point.setY(state[ykey]);
    if (zkey && state.hasOwnProperty(zkey)) point.setZ(state[zkey]);

    return point;
  };

  private _receiveMessage = (evt: Event) => {
    if (evt.type !== "message") {
      return;
    }

    const messageStr = (evt as any).data;
    if (typeof messageStr !== "string") return;

    let message: IterationUpdateMessage;
    try {
      message = JSON.parse(messageStr);
    } catch (err) {
      return;
    }
    if (!semver.satisfies(message.version, CompatibleVersion)) {
      return;
    }
    if (message.type !== MessageType.IterationUpdate) {
      return;
    }

    const history = this.state.history;
    history.push(this._nextPoint());
    if (history.length >= this.state.historyLimit) {
      history.shift();
    }

    this.setState({
      theme: this.state.theme,
      isModelValid: true,
      model: {
        state: {
          ...(message.state as { [key: string]: any }),
        },
      },
      history: history,
    });
  };

  private _getInitialTheme(queryParams: URLSearchParams): ThemeMode {
    const theme = queryParams.get(QueryParams.Theme);
    return theme === ThemeMode.Dark ? ThemeMode.Dark : ThemeMode.Light;
  }
}

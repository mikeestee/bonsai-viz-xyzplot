/*
 * PlotRenderer.tsx
 * Copyright: Microsoft 2019
 *
 * Renders the plot in 3D.
 */

import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
interface PlotRendererProps {
    theme: 'light' | 'dark';
    isModelValid: boolean;
    history: THREE.Vector3[];
}

interface RendererState {}

const baseDimension = 0.2;
export class PlotRenderer extends Component<PlotRendererProps, RendererState> {
    private _container: HTMLDivElement | null = null;
    private _scene?: THREE.Scene;
    private _camera?: THREE.PerspectiveCamera;
    private _renderer?: THREE.WebGLRenderer;

    private _axesHelper?: THREE.Object3D;
    private _historyLines?: THREE.Line;

    constructor(props: PlotRendererProps) {
        super(props);

        this.state = {};
    }

    _updateHistoryLines(lines: THREE.Line): void {
        const history = this.props.history;
        const vertices: number[] = [];
        const colors: number[] = [];

        // map the history lines in
        const startColor = new THREE.Color(0.8, 0.8, 1);
        const endColor = new THREE.Color(0.8, 0, 0);

        for (let i = 0; i < history.length; i++) {
            const point = history[i];
            const color = startColor.lerp(endColor, i / history.length);

            vertices.push(point.x, point.y, point.z);
            colors.push(color.r, color.g, color.b);
        }

        // update
        lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        lines.geometry.attributes.position.needsUpdate = true;

        lines.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        lines.geometry.attributes.color.needsUpdate = true;

        // autoscaling
        lines.geometry.computeBoundingBox();
        const box = lines.geometry.boundingBox;
        const diff = box?.max.sub(box.min);
        if (diff) {
            const xscale = Number.isFinite(diff.x) ? Math.abs(diff.x) : 1;
            const yscale = Number.isFinite(diff.y) ? Math.abs(diff.y) : 1;
            const zscale = Number.isFinite(diff.z) ? Math.abs(diff.z) : 1;

            const scale = Math.max(xscale, yscale, zscale) ?? 1.0;
            lines.scale.set(1 / scale, 1 / scale, 1 / scale);
        }
    }

    componentDidMount(): void {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        this._renderer = new THREE.WebGLRenderer({ antialias: true });
        this._scene = new THREE.Scene();

        // create the XYZ axis edges
        this._axesHelper = new THREE.AxesHelper(2);
        this._axesHelper.translateX(-1).translateY(-1).translateZ(-1);
        this._scene!.add(this._axesHelper);

        // Create the floor plane
        const planeGeom = new THREE.PlaneGeometry(2.0, 2.0, 1, 1);
        const grayMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.3, 0.3, 0.3),
            reflectivity: 1.0,
            shininess: 100,
            side: THREE.DoubleSide,
        });
        const baseMesh = new THREE.Mesh(planeGeom, grayMaterial);
        baseMesh.rotateX(-Math.PI / 2);
        baseMesh.translateZ(-1.001);
        this._scene?.add(baseMesh);

        // Create the history lines
        const lineMaterial = new THREE.LineBasicMaterial({ vertexColors: true });
        const lineGeometry = new THREE.BufferGeometry();
        this._historyLines = new THREE.Line(lineGeometry, lineMaterial);
        this._updateHistoryLines(this._historyLines);

        this._scene?.add(this._historyLines);

        // Set up the renderer.
        this._renderer!.setSize(windowWidth, windowHeight);
        this._renderer!.shadowMap.enabled = true;
        this._renderer!.shadowMap.type = THREE.PCFSoftShadowMap;

        // Set up the camera.
        this._camera = new THREE.PerspectiveCamera(40, windowWidth / windowHeight, 0.1, 1000);
        this._camera.position.z = 4.0;
        this._camera.position.y = 0.2;
        this._camera.position.x = -0.2;

        // Set up point lights.
        const locations = [
            [-0.25, 2, 0],
            [0.25, 2, 0],
        ];
        locations.forEach(loc => {
            const light = new THREE.PointLight(0xffffff, 0.85, 50, 1.25);
            light.position.set(loc[0], loc[1], loc[2]);
            light.lookAt(0, 0, 0);
            this._scene!.add(light);
        });

        // Set up ambient light.
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this._scene!.add(ambientLight);

        // Install handlers.
        window.addEventListener('resize', this._onWindowResize, false);

        this._container!.appendChild(this._renderer!.domElement);

        // Add controls.
        const controls = new OrbitControls(this._camera, this._renderer!.domElement);
        controls.target = new THREE.Vector3(0, baseDimension / 2, 0);
        controls.enableZoom = false;
        controls.enableKeys = false;
        controls.addEventListener('change', () => {
            if (this.props.isModelValid) {
                this._render3DScene();
            }
        });
        controls.update();
    }

    componentWillUnmount(): void {
        // Uninstall handlers.
        window.removeEventListener('resize', this._onWindowResize);
    }

    render(): JSX.Element {
        if (this.props.isModelValid && this._historyLines) {
            this._updateHistoryLines(this._historyLines);
            this._render3DScene();
        }
        return <div ref={ref => this._onMount(ref)} />;
    }

    private _render3DScene(): void {
        if (!this._scene || !this._axesHelper || !this._renderer || !this._camera) {
            return;
        }

        const backgroundColor = this.props.theme === 'light' ? 0xffffff : 0x1a1a1a;
        this._scene.background = new THREE.Color(backgroundColor);

        // Render scene.
        this._renderer.render(this._scene, this._camera);
    }

    private _onMount = (ref: HTMLDivElement | null) => {
        this._container = ref;
    };

    private _onWindowResize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        if (!this._camera || !this._renderer) {
            return;
        }

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    };
}

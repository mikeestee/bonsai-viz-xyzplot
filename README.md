# Bonsai XYZ Plot Visualizer

This visualizer will let you plot any three state variables in 3 dimensions. You can specify default state variables for each like so:

```
http://localhost:3000/plotviz?x=cart_position&y=pole_center_position
```

![XYZ Plot](XYZPlot.png)

# Installing

You will need to clone and build the `microsoft-bonsai-visualizer` library before building this project. The library must live next to this project in the parent directory.

```bash
cd ~/
git clone git@github.com:microsoft/microsoft-bonsai-visualizer.git
cd ~/microsoft-bonsai-visualizer
npm install
npm run build
```

## Building

```bash
cd ~/bonsai-viz-xyzplot
npm install
npm start
```

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.opensource.microsoft.com.

When you submit a pull request, a CLA bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., status check, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Trademarks

This project may contain trademarks or logos for projects, products, or services. Authorized use of Microsoft
trademarks or logos is subject to and must follow
[Microsoft's Trademark & Brand Guidelines](https://www.microsoft.com/en-us/legal/intellectualproperty/trademarks/usage/general).
Use of Microsoft trademarks or logos in modified versions of this project must not cause confusion or imply Microsoft sponsorship.
Any use of third-party trademarks or logos are subject to those third-party's policies.

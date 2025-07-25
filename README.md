## EC50 Analysis

### Introduction

A key metric in evaluating such drugs is the [EC50](https://en.wikipedia.org/wiki/EC50), which represents the concentration at which a drug achieves 50% of its maximum effect.

To estimate the EC50, we use dose-response data, specifically measuring tumour cell death (%) across a range of Concentrations (nM).

The simplest method to estimate EC50 is by fitting a straight line to the data using linear regression, where:

* X is the Concentration (nM)
* Y is the Tumour Cell Killing (%)

The line is defined as:

```
Y = m * X + c
```

Using the regression line, EC50 can be estimated as:

```
EC50 = (0.5 - c)/m
```

However, dose-response curves are often nonlinear. A better approach is to apply a logarithmic transformation to the concentration values, which usually results in a curve that can be more accurately modeled using linear regression.


This app allows scientists to analyse dose-response data. 


* You can upload a CSV file containing dose-response data
* A scatter plot showing concentration on the x-axis and tumour cell killing on the y-axis will be generated
* A liner regression line will be shown on the plot
* The EC50 value will be displayed
* Users can manually exclude/include points on the plot by clicking. When a point is removed or re-added the regression line and EC50 value will be automatically be re-generated
* The current state is saved so that it can be reloaded when a new browser session is opened

See `example.csv` for an example of the input CSV file.

### Testing your code

You can deploy your app locally using the following steps:

Install python dependencies (requires Python version 3.9)
```
pip install -r requirements.txt
```

Install typescript dependencies
```
cd frontend
npm install
cd -
```

Launch the app
```
npm run start --prefix frontend & DEBUG=True python -m app.serve
```

Alternatively, you can launch the app using `docker-compose`:
```
docker-compose up --build
```



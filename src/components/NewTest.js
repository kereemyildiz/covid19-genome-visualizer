import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { moment } from "moment";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

function NewTest() {
	const chartRef = useRef();
	function generate(x1, x2, init) {
		if (moment.isMoment(x1)) {
			// translate time to x1, x2
			x1 =
				-2 -
				moment()
					.add(-2 * 86400, "seconds")
					.diff(x1, "seconds") /
					86400;
			x2 =
				2 -
				moment()
					.add(2 * 86400, "seconds")
					.diff(x2, "seconds") /
					86400;
		}

		var data = [];
		var x = x1;

		var a = 0.7;
		var b = 8;

		var t = moment().add(x1 * 86400, "seconds");
		var t2 = moment().add(x2 * 86400, "seconds");

		while (x <= x2) {
			var y = 0;
			for (var n = 0; n < 10; n++) {
				y += Math.pow(a, n) * Math.cos(Math.pow(b, n) * 3.14 * x);
			}
			data.push({ x: moment().add(x * 86400, "seconds"), y: y });

			x += (x2 - x1) / 100;
		}

		return data;
	}

	useEffect(() => {
		const currentChartRef = chartRef.current;

		if (currentChartRef) {
			const ctx = currentChartRef.getContext("2d");
			if (ctx) {
				var chart6 = new Chart(ctx, {
					type: "scatter",
					options: {
						plugins: {
							crosshair: {
								sync: {
									enabled: false,
								},
								pan: {
									incrementer: 3, // Defaults to 5 if not included.
								},
								callbacks: {
									afterZoom: () =>
										function (start, end) {
											setTimeout(function () {
												chart6.data.datasets[0].data = generate(
													moment(start),
													moment(end)
												);
												chart6.update();
											}, 1000);
										},
								},
							},
						},
						tooltip: {
							mode: "interpolate",
							intersect: false,
							callbacks: {
								title: function (a, d) {
									return a[0].xLabel.format("dd D MMM YYYY HH:mm");
								},
								label: function (i, d) {
									return (
										d.datasets[i.datasetIndex].label +
										": " +
										i.yLabel.toFixed(2)
									);
								},
							},
						},
						animation: {
							duration: 0,
						},
						scales: {
							x: {
								type: "time",
							},
							y: {
								ticks: {
									min: -3,
									max: 4,
								},
							},
						},

						responsiveAnimationDuration: 0,
					},
					data: {
						datasets: [
							{
								backgroundColor: "red",
								borderColor: "red",
								showLine: true,
								fill: false,
								label: "function",
								pointRadius: 0,
								data: generate(-2, 2),
								lineTension: 0,
								interpolate: true,
							},
						],
					},
				});
			}
		}
	}, []);
	return (
		<div>
			<canvas ref={chartRef} />
		</div>
	);
}

export default NewTest;

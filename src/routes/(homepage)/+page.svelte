<script lang="ts">
	import { onMount } from 'svelte';
	import '../../app.css';
	import Chart from 'chart.js/auto';
	import autoAnimate from "@formkit/auto-animate"

	let chart: any;

	export let data;
	let bruh = data;

	const totalVotes = bruh.contestants.reduce((sum, contestant) => sum + contestant.votes, 0);

	let contestantsWithPercentage: any = [];

	const calculatePercentages = () => {
		const totalVotes = bruh.contestants.reduce((sum, contestant) => sum + contestant.votes, 0);

		contestantsWithPercentage = bruh.contestants.map((contestant) => ({
			name: contestant.name,
			votes: contestant.votes,
			percentage: totalVotes > 0 ? Math.round((contestant.votes / totalVotes) * 100) : 0,
			image: contestant.image
		}));
	};

	const sortContestants = () => {
		bruh = {
			...bruh,
			contestants: bruh.contestants.slice().sort((a, b) => b.votes - a.votes)
		};

		calculatePercentages();
		updateChart();
	};

	const updateChart = () => {
		if (chart) {
			chart.data.labels = contestantsWithPercentage.map((contestant) => contestant.name);
			chart.data.datasets[0].data = contestantsWithPercentage.map((contestant) => contestant.votes);
			chart.update();
		}
	};

	onMount(() => {
		// @ts-ignore
		const ctx = document.getElementById('chart').getContext('2d');
		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: contestantsWithPercentage.map((contestant) => contestant.name),
				datasets: [
					{
						label: 'Votes',
						data: contestantsWithPercentage.map((contestant) => contestant.votes),
						backgroundColor: [
							'rgba(255, 174, 66, 0.7)',
							'rgba(101, 198, 190, 0.5)',
							'rgba(255, 131, 149, 0.5)',
							'rgba(155, 197, 61, 0.5)',
							'rgba(174, 149, 221, 0.5)',
							'rgba(255, 187, 153, 0.5)',
							'rgba(134, 219, 233, 0.5)',
							'rgba(226, 165, 184, 0.5)',
							'rgba(229, 242, 135, 0.5)',
							'rgba(128, 229, 163, 0.5)',
							'rgba(255, 209, 170, 0.5)',
							'rgba(188, 216, 221, 0.5)',
							'rgba(210, 186, 222, 0.5)',
							'rgba(241, 195, 187, 0.5)',
							'rgba(170, 230, 230, 0.5)',
							'rgba(230, 153, 141, 0.5)',
							'rgba(255, 212, 203, 0.5)',
							'rgba(193, 246, 181, 0.5)',
							'rgba(250, 218, 221, 0.5)'
						],
						borderColor: [
							'rgba(255, 174, 66, 17)',
							'rgba(101, 198, 190, 1)',
							'rgba(255, 131, 149, 1)',
							'rgba(155, 197, 61, 1)',
							'rgba(174, 149, 221, 1)',
							'rgba(255, 187, 153, 1)',
							'rgba(134, 219, 233, 1)',
							'rgba(226, 165, 184, 1)',
							'rgba(229, 242, 135, 1)',
							'rgba(128, 229, 163, 1)',
							'rgba(255, 209, 170, 1)',
							'rgba(188, 216, 221, 1)',
							'rgba(210, 186, 222, 1)',
							'rgba(241, 195, 187, 1)',
							'rgba(170, 230, 230, 1)',
							'rgba(230, 153, 141, 1)',
							'rgba(255, 212, 203, 1)',
							'rgba(193, 246, 181, 1)',
							'rgba(250, 218, 221, 1)'
						],
						borderWidth: 1
					}
				]
			},
			options: {
				plugins: {
					legend: {
						display: true
					}
				}
			}
		});
		calculatePercentages();
		sortContestants();
	});
</script>

<div class="flex min-h-screen w-full flex-col p-4 md:p-10">
	<main
		class="flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 bg-gray-100/40 p-4 md:gap-8 md:p-10"
	>
		<div class="mx-auto flex w-full max-w-6xl items-center gap-4">
			<h1 class="text-2xl font-bold">Vote Rankings</h1>
		</div>
		<div class="mx-auto grid w-full max-w-6xl gap-6">
			<div class="container mx-auto">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
					<div use:autoAnimate class="rounded bg-white p-4 shadow">
						{#each contestantsWithPercentage as { name, percentage, votes, image }}
							<div class="bg-card text-card-foreground rounded-lg border shadow-md mb-3">
								<div class="flex flex-row items-center gap-4 space-y-1.5 p-6">
									<span  class="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full">
										<span
											class="bg-muted flex h-full w-full items-center justify-center rounded-full"
										>
											<img src={image} alt="Contestant Profile Picture" />
										</span>
									</span>
									<div class="grid gap-1">
										<h3 class="text-2xl font-semibold leading-none tracking-tight">{name}</h3>
										<p class="text-muted-foreground text-sm">Votes : {votes} ({percentage}%)</p>
									</div>
								</div>
							</div>
						{/each}
					</div>
					<div class="rounded bg-white p-4 shadow">
						<canvas bind:this={chart} id="chart"></canvas>
					</div>
				</div>
			</div>
		</div>
	</main>
</div>

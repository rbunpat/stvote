<script lang="ts">

	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { createClient } from '@supabase/supabase-js';

	import autoAnimate from '@formkit/auto-animate';
	import Chart from 'chart.js/auto';

	import '../../app.css';

	const supabaseUrl = 'https://mpibovldubkdqttudkdu.supabase.co';
	const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waWJvdmxkdWJrZHF0dHVka2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMTA1MTgsImV4cCI6MjAxOTY4NjUxOH0.UFL1SVBNIv_VL9Sd6Caq0HYQe0XhvFCI5Yj9fLoy-YY';

	const supabase = createClient(supabaseUrl, supabaseKey);

	const contestants = writable([]);
	const chartData = writable([]);
	const totalVotesToShow = writable(0);

	const contestantsTable = 'Contestant';
	
	let chart: HTMLCanvasElement | Chart<"doughnut", any[], any>;

	let contestantsListener;

	let contestantsWithPercentage: any = [];


	const calculatePercentage = (votes: number, totalVotes: number) => {
		return ((votes / totalVotes) * 100).toFixed(2);
	};

	const updateChart = () => {
		if (chart) {
			(chart.data.labels = $contestants.map((contestant) => contestant.name)),
				(chart.data.datasets[0].data = $contestants.map((contestant) => contestant.votes)),
				chart.update();
		}
	};

	onMount(async () => {
		// Fetch initial contestants data
		const { data, error } = await supabase.from(contestantsTable).select('id, votes, image, name');

		if (error) {
			console.error('Error fetching contestants data:', error.message);
		} else {
			// Set the initial values for each contestant
			contestants.set(data);
		}

		// Subscribe to real-time updates for contestants
		contestantsListener = supabase
			.channel(`schema-db-changes`)
			.on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
				// Update the store with the new values
				contestants.update((oldContestants) => {
					const index = oldContestants.findIndex((c) => c.id === payload.new.id);

					if (index !== -1) {
						// Update the existing contestant
						oldContestants[index] = payload.new;
					} else {
						// Add the new contestant to the array
						oldContestants.push(payload.new);
					}

					// Calculate total votes
					const totalVotes = oldContestants.reduce(
						(total, contestant) => total + contestant.votes,
						0
					);

					// Calculate and update the percentage for each contestant
					contestantsWithPercentage = oldContestants.map((contestant) => ({
						...contestant,
						percentage: calculatePercentage(contestant.votes, totalVotes)
					}));
					contestantsWithPercentage.sort((a, b) => b.votes - a.votes);

					updateChart();

					//set total votes
					totalVotesToShow.set(totalVotes);

					return contestantsWithPercentage;
				});
			})
			.subscribe();

		const totalVotes = $contestants.reduce((total, contestant) => total + contestant.votes, 0);
		contestantsWithPercentage = $contestants.map((contestant) => ({
			...contestant,
			percentage: calculatePercentage(contestant.votes, totalVotes)
		}));

		contestants.set(contestantsWithPercentage);
		contestantsWithPercentage.sort((a, b) => b.votes - a.votes);

		totalVotesToShow.set(totalVotes);

		//charts
		const ctx = document.getElementById('chart').getContext('2d');
		chart = new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: $contestants.map((contestant) => contestant.name),
				datasets: [
					{
						label: 'Votes',
						data: $contestants.map((contestant) => contestant.votes),
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
	});

	onDestroy(() => {
		// Unsubscribe from real-time updates when the component is unmounted
		supabase.removeAllChannels();
	});
</script>

<div class="flex min-h-screen w-full flex-col p-4 md:p-10">
	<main
		class="flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 bg-gray-100/40 p-4 md:gap-8 md:p-10"
	>
		<div class="mx-auto flex w-full max-w-6xl items-center gap-4">
			<h1 class="text-2xl font-bold">Total Votes : {$totalVotesToShow}</h1>
		</div>
		<div class="mx-auto grid w-full max-w-6xl gap-6">
			<div class="container mx-auto">
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
					<div use:autoAnimate class="rounded bg-white p-4 shadow">
						{#each $contestants as { id, votes, image, name, percentage } (id)}
							<div class="bg-card text-card-foreground mb-3 rounded-lg border shadow-md">
								<div class="flex flex-row items-center gap-4 space-y-1.5 p-6">
									<span class="relative flex h-16 w-16 shrink-0 overflow-hidden rounded-full">
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
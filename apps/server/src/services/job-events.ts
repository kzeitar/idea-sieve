import { EventEmitter } from "node:events";
import type { TaskResult, ValidationJobDetails } from "@idea-sieve/ai";

export interface JobUpdateEvent {
	jobId: string;
	job: ValidationJobDetails;
	tasks: TaskResult[];
	progress: {
		progress: number;
		isComplete: boolean;
	};
}

/**
 * Event emitter for broadcasting validation job updates
 * Used by SSE endpoints to push real-time updates to clients
 */
class JobEventsEmitter extends EventEmitter {
	/**
	 * Emit a job update event
	 */
	emitJobUpdate(event: JobUpdateEvent): void {
		this.emit(`job:${event.jobId}`, event);
	}

	/**
	 * Subscribe to updates for a specific job
	 */
	onJobUpdate(jobId: string, listener: (event: JobUpdateEvent) => void): void {
		this.on(`job:${jobId}`, listener);
	}

	/**
	 * Unsubscribe from updates for a specific job
	 */
	offJobUpdate(jobId: string, listener: (event: JobUpdateEvent) => void): void {
		this.off(`job:${jobId}`, listener);
	}
}

export const jobEvents = new JobEventsEmitter();

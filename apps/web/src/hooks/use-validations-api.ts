import type { ValidationReport } from "@idea-sieve/ai";
import { useCallback, useEffect, useState } from "react";
import * as storageApi from "@/lib/storage-api";
import type { StoredValidation } from "@/lib/types";

export function useValidationsApi() {
	const [validations, setValidations] = useState<StoredValidation[]>([]);
	const [loading, setLoading] = useState(true);

	const loadValidations = useCallback(async () => {
		setLoading(true);
		try {
			const data = await storageApi.getAllValidations();
			setValidations(data);
		} catch (error) {
			console.error("Error loading validations:", error);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		loadValidations();
	}, [loadValidations]);

	const refetch = useCallback(() => {
		loadValidations();
	}, [loadValidations]);

	const createInProgressValidation = useCallback(
		async (
			input: Parameters<typeof storageApi.createInProgressValidation>[0],
		): Promise<string> => {
			const id = await storageApi.createInProgressValidation(input);
			await loadValidations();
			return id;
		},
		[loadValidations],
	);

	const updateInProgressValidation = useCallback(
		(
			id: string,
			updates: Parameters<typeof storageApi.updateInProgressValidation>[1],
		) => {
			storageApi.updateInProgressValidation(id, updates);
			loadValidations();
		},
		[loadValidations],
	);

	const completeValidation = useCallback(
		async (id: string, report: ValidationReport): Promise<void> => {
			await storageApi.completeValidation(id, report);
			await loadValidations();
		},
		[loadValidations],
	);

	const getById = useCallback(
		async (id: string): Promise<StoredValidation | null | undefined> => {
			return storageApi.getValidationById(id);
		},
		[],
	);

	const deleteValidation = useCallback(
		async (id: string): Promise<void> => {
			await storageApi.deleteValidation(id);
			await loadValidations();
		},
		[loadValidations],
	);

	return {
		validations,
		loading,
		refetch,
		createInProgressValidation,
		updateInProgressValidation,
		completeValidation,
		getById,
		deleteValidation,
	};
}

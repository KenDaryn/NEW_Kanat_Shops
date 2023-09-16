export interface PostgreSQLError {
	data: {
		[key: string]: {
			message: string;
		};
	};
}

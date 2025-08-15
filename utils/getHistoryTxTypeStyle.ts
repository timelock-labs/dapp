const getHistoryTxTypeStyle = (type: string) => {
	switch (type) {
		case 'executed':
			return 'bg-green-100 text-green-800';
		case 'expired':
			return 'bg-red-100 text-red-800';
		case 'cancelled':
			return 'bg-gray-100 text-gray-800';
		case 'queued':
			return 'bg-blue-100 text-blue-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};

export default getHistoryTxTypeStyle;
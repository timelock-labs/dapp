const getHistoryTxTypeStyle = (type: string) => {
	switch (type) {
		case 'waiting':
			return 'bg-blue-100 text-blue-800';
		case 'ready':
			return 'bg-green-100 text-green-800';
		case 'cancelled':
			return 'bg-red-100 text-red-800';
		case 'expired':
			return 'bg-gray-100 text-gray-800';
		case 'executed':
			return 'bg-yellow-100 text-yellow-800';
		default:
			return 'bg-gray-200 text-gray-800';
	}
};

export default getHistoryTxTypeStyle;

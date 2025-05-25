const aplicarFiltros = (turnos, filtros) => {
	return turnos.filter((turno) => {
		if (filtros.id && String(turno.id) !== filtros.id) return false;
		if (
			filtros.nombre &&
			!turno.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase())
		)
			return false;
		if (
			filtros.apellido &&
			!turno.apellido?.toLowerCase().includes(filtros.apellido.toLowerCase())
		)
			return false;
		if (
			filtros.mascota &&
			!turno.mascota?.toLowerCase().includes(filtros.mascota.toLowerCase())
		)
			return false;
		if (
			filtros.profesional &&
			!turno.profesional
				?.toLowerCase()
				.includes(filtros.profesional.toLowerCase())
		)
			return false;
		if (
			filtros.tipoConsulta &&
			!turno.tipoConsulta
				?.toLowerCase()
				.includes(filtros.tipoConsulta.toLowerCase())
		)
			return false;
		if (filtros.fecha && !turno.fecha?.includes(filtros.fecha)) return false;
		if (filtros.estado) {
			const estadoBool = filtros.estado === "true";
			if (turno.estado !== estadoBool) return false;
		}
		return true;
	});
};

module.exports = aplicarFiltros;

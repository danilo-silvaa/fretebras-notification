# FreteBras Notificação

Este projeto foi desenvolvido com o propósito de proporcionar notificações sobre novos fretes na plataforma FreteBras. Para alcançar esse objetivo, implementei um service worker que executa o código JavaScript em segundo plano. O serviço periodicamente consulta a API a cada N segundos, verifica se há novas entregas e, em caso afirmativo, dispara uma notificação.
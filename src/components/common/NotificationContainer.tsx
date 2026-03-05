import { useEffect, useRef, useState } from 'react';
import { useNotificationStore } from '@/stores';
import { IconX } from '@/components/ui/icons';
import type { Notification } from '@/types';

interface AnimatedNotification extends Notification {
  isExiting?: boolean;
}

const ANIMATION_DURATION = 300; // ms (duración de la animación)

export function NotificationContainer() {
  const { notifications, removeNotification } = useNotificationStore();
  const [animatedNotifications, setAnimatedNotifications] = useState<AnimatedNotification[]>([]);
  const prevNotificationsRef = useRef<Notification[]>([]);

  // Rastrear notificaciones y gestionar estados de animación
  useEffect(() => {
    const prevNotifications = prevNotificationsRef.current;
    const prevIds = new Set(prevNotifications.map((n) => n.id));
    const currentIds = new Set(notifications.map((n) => n.id));

    // Encontrar nuevas notificaciones (para animación de entrada)
    const newNotifications = notifications.filter((n) => !prevIds.has(n.id));

    // Encontrar notificaciones eliminadas (para animación de salida)
    const removedIds = new Set(
      prevNotifications.filter((n) => !currentIds.has(n.id)).map((n) => n.id)
    );

    setAnimatedNotifications((prev) => {
      // Marcar las notificaciones eliminadas como salientes (exiting)
      let updated = prev.map((n) =>
        removedIds.has(n.id) ? { ...n, isExiting: true } : n
      );

      // Añadir nuevas notificaciones
      newNotifications.forEach((n) => {
        if (!updated.find((an) => an.id === n.id)) {
          updated.push({ ...n, isExiting: false });
        }
      });

      // Eliminar las notificaciones que no están en las actuales y no están saliendo
      // (ya han completado su animación de salida)
      updated = updated.filter(
        (n) => currentIds.has(n.id) || n.isExiting
      );

      return updated;
    });

    // Limpiar las notificaciones que ya salieron después de la animación
    if (removedIds.size > 0) {
      setTimeout(() => {
        setAnimatedNotifications((prev) =>
          prev.filter((n) => !removedIds.has(n.id))
        );
      }, ANIMATION_DURATION);
    }

    prevNotificationsRef.current = notifications;
  }, [notifications]);

  const handleClose = (id: string) => {
    // Iniciar animación de salida
    setAnimatedNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isExiting: true } : n))
    );

    // Eliminar realmente después de la animación
    setTimeout(() => {
      removeNotification(id);
    }, ANIMATION_DURATION);
  };

  if (!animatedNotifications.length) return null;

  return (
    <div className="notification-container">
      {animatedNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type} ${notification.isExiting ? 'exiting' : 'entering'}`}
        >
          <div className="message">{notification.message}</div>
          <button className="close-btn" onClick={() => handleClose(notification.id)} aria-label="Cerrar">
            <IconX size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}

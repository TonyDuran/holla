package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/TonyDuran/holla/backend/aimx/internal/config"
	httpserver "github.com/TonyDuran/holla/backend/aimx/internal/http"
	"github.com/TonyDuran/holla/backend/aimx/internal/storage/postgres"
)

func main() {
	// ---- load config ----
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	// ---- db connection ----
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	db, err := postgres.Open(ctx, cfg.Postgres)
	if err != nil {
		log.Fatalf("db: %v", err)
	}
	defer db.Close()

	// ---- http server ----
	srv := httpserver.New(httpserver.Config{
		Addr: cfg.HTTP.Addr,
		DB:   db,
	})

	// ---- graceful shutdown ----
	go func() {
		if err := srv.ListenAndServe(); err != nil {
			log.Fatalf("http: %v", err)
		}
	}()

	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig

	ctx, cancel = context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_ = srv.Shutdown(ctx)
	log.Println("shutdown complete")
}

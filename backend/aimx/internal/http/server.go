package http

import (
	"context"
	"net/http"
)

type Config struct {
	Addr string
	DB   interface{}
}

type Server struct {
	srv *http.Server
}

func New(cfg Config) *Server {
	return &Server{
		srv: &http.Server{
			Addr: cfg.Addr,
		},
	}
}

func (s *Server) ListenAndServe() error {
	return s.srv.ListenAndServe()
}

func (s *Server) Shutdown(ctx context.Context) error {
	return s.srv.Shutdown(ctx)
}

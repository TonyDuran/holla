package postgres

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	Pool *pgxpool.Pool
}

func Open(ctx context.Context, cfg interface{}) (*DB, error) {
	//TODO: fix as this is just a stub
	return &DB{}, nil
}

func (db *DB) Close() {}

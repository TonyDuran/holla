package config

type Config struct {
	HTTP struct {
		Addr string
	}
	Postgres PostgresConfig
}

type PostgresConfig struct {
	DSN string
}

func Load() (*Config, error) {
	cfg := &Config{}
	//TODO: move these environment variables
	cfg.HTTP.Addr = ":8080"
	cfg.Postgres.DSN = "postgres://localhost"
	return cfg, nil
}

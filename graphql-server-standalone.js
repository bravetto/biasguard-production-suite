/**
 * BiasGuard GraphQL Server - Standalone Runner
 * Initializes and starts the GraphQL server with the existing dashboard API
 * Version 2.0.0
 */

const BiasGuardDashboardAPI = require('./dashboard-api.js');
const BiasGuardGraphQLServer = require('./graphql-server.js');

class StandaloneLauncher {
    constructor() {
        this.dashboardAPI = null;
        this.graphqlServer = null;
    }

    async start() {
        try {
            console.log('🚀 Starting BiasGuard GraphQL Server...');

            // Initialize the dashboard API (data layer)
            this.dashboardAPI = new BiasGuardDashboardAPI();
            
            // Start the dashboard API server
            await new Promise((resolve) => {
                this.dashboardAPI.start().then(() => {
                    console.log('✅ Dashboard API initialized');
                    resolve();
                });
            });

            // Initialize and start the GraphQL server
            this.graphqlServer = new BiasGuardGraphQLServer(this.dashboardAPI);
            await this.graphqlServer.start();

            console.log('🎉 BiasGuard GraphQL Server fully operational!');

            // Handle graceful shutdown
            process.on('SIGTERM', () => this.shutdown());
            process.on('SIGINT', () => this.shutdown());

        } catch (error) {
            console.error('❌ Failed to start BiasGuard GraphQL Server:', error);
            process.exit(1);
        }
    }

    async shutdown() {
        console.log('🛑 Shutting down BiasGuard GraphQL Server...');

        try {
            if (this.graphqlServer) {
                await this.graphqlServer.stop();
                console.log('✅ GraphQL server stopped');
            }

            if (this.dashboardAPI) {
                await this.dashboardAPI.stop();
                console.log('✅ Dashboard API stopped');
            }

            console.log('👋 BiasGuard GraphQL Server shutdown complete');
            process.exit(0);
        } catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    }
}

// Start the server if this file is run directly
if (require.main === module) {
    const launcher = new StandaloneLauncher();
    launcher.start();
}

module.exports = StandaloneLauncher;
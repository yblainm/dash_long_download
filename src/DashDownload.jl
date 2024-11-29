
module DashDownload
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.0.1"

include("jl/download.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_download",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-null.js",
    external_url = "https://unpkg.com/dash_download@0.0.1/dash_download/async-null.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-null.js.map",
    external_url = "https://unpkg.com/dash_download@0.0.1/dash_download/async-null.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_download.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_download.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
